import sys
import pypyodbc
import arcpy
import os.path
import time

workspace = sys.argv[1]
street = os.path.abspath(sys.argv[2])
parcel = sys.argv[3]
# parcel = parcel.replace("\\", "\\\\")
output = sys.argv[4] + str(int(time.time()))
# result = add(firstArgv,secondArgv)
# win32api.MessageBox(0, result, 'Input')


#Create live sql art80 point
server = 'zbrasql'
db = 'braweb'
user = 'arcgis_article80'
password = 'pipeline!'

conn = pypyodbc.connect(r'DRIVER={SQL Server};SERVER=' + server + ';DATABASE=' + db + ';UID=' + user + ';PWD='+ password)

sql = """

SELECT ProjectID,ProjectName,ProjectManager,webcategory,lat,lon
FROM DevelopmentProjects

"""

cur = conn.cursor()

cur.execute(sql)
arcpy.env.workspace = os.path.abspath(workspace)
featureName = "art80_point_from_sql_" + str(int(time.time()))
workspace = arcpy.env.workspace
spatial_reference = arcpy.SpatialReference(4326)
# arcpy.CreateFeatureclass_management(workspace, featureName ,"POINT","","DISABLED","DISABLED",spatial_reference)
# arcpy.AddField_management(featureName,"ProjectID","TEXT","",16)
# arcpy.AddField_management(featureName,"ProjectName","TEXT","",32)
# arcpy.AddField_management(featureName,"WebCategory","TEXT","",16)
# arcpy.AddField_management(featureName,"ProjectManager","TEXT","",16)
arcpy.CreateFeatureclass_management(workspace, featureName ,"POINT","article80_points_fromsql_template","DISABLED","DISABLED",spatial_reference)
edit_points = arcpy.da.InsertCursor(featureName,"*")
edit_points.fields

count = 0
for project in cur.fetchall():
    point_obj = arcpy.Point(float(project['lon']),float(project['lat']))

    row = [count, point_obj,project['projectid'],project['projectname'],project['webcategory'],project['projectmanager']]
    edit_points.insertRow(row)
#     print count,project['lat'],project['lon']
    count = count + 1


del edit_points
# win32api.MessageBox(0, arcpy.env.workspace, featureName)

#Spatially select art80 polygon with live sql art80 point
parcel_select = "art80_parcel_intersect_temp_" + str(int(time.time()))
arcpy.MakeFeatureLayer_management(parcel, parcel_select)
arcpy.SelectLayerByLocation_management(parcel_select, "INTERSECT", featureName)
parcel_out = "art80_parcel_intersect_" + str(int(time.time()))
arcpy.CopyFeatures_management(parcel_select, parcel_out)

parcel_joined = "Art80_Parcel_joined_" + str(int(time.time()))
arcpy.SpatialJoin_analysis(parcel_out,featureName, parcel_joined, "JOIN_ONE_TO_MANY","KEEP_ALL","","","","")

parcel_buffered = "Art80_Parcel_buffered_" + str(int(time.time()))
arcpy.Buffer_analysis(parcel_joined,parcel_buffered,"70 Feet",'FULL','ROUND','NONE')

server = 'vsql22.cityhall.boston.cob'
db = 'PWD_cobucs'
user = 'sqlBRA'
password = 'sqlBRA!2016'

conn = pypyodbc.connect(r'DRIVER={SQL Server};SERVER=' + server + ';DATABASE=' + db + ';UID=' + user + ';PWD='+ password)

sql = """

SELECT *
FROM dbo.View_1 WITH (nolock)

"""

cur = conn.cursor()

cur.execute(sql)

route_table = 'route_table_' + str(int(time.time()))
# Execute CreateTable
arcpy.CreateTable_management(workspace, route_table)

# Set local variables

arcpy.AddField_management(route_table,"ticketID","TEXT")
arcpy.AddField_management(route_table, "Street", "TEXT")
arcpy.AddField_management(route_table, "From_street","TEXT")
arcpy.AddField_management(route_table, "To_street", "TEXT")
arcpy.AddField_management(route_table, "completionDate","DATE",)
arcpy.AddField_management(route_table, "endDate", "DATE")
arcpy.AddField_management(route_table, "beginDate", "DATE")
arcpy.AddField_management(route_table, "reptype", "TEXT")
arcpy.AddField_management(route_table, "justification","TEXT")
arcpy.AddField_management(route_table, "reference","TEXT")
arcpy.AddField_management(route_table, "lastEditBy","TEXT")
arcpy.AddField_management(route_table, "conflict","TEXT")
arcpy.AddField_management(route_table, "parent","TEXT",16)
arcpy.AddField_management(route_table, "loStation","LONG")
arcpy.AddField_management(route_table, "hiStation","LONG")

rows = arcpy.InsertCursor(route_table)
for seg in cur.fetchall():
    row=rows.newRow()
    row.setValue("ticketID", seg['ticketid'])
    row.setValue("Street", seg['street'])
    row.setValue("From_street", seg['from_street'])
    row.setValue("To_street", seg['to_street'])
    row.setValue("completionDate", seg['completiondate'])
    row.setValue("endDate", seg['enddate'])
    row.setValue("beginDate", seg['begindate'])
    row.setValue("reptype", seg['reptype'])
    row.setValue("justification", seg['justification'])
    row.setValue("reference", seg['reference'])
    row.setValue("lastEditBy", seg['lasteditby'])
    row.setValue("conflict", seg['conflict'])
    row.setValue("parent", seg['parent'])
    row.setValue("loStation", seg['lostation'])
    row.setValue("hiStation", seg['histation'])
    rows.insertRow(row)
cur.close()
del row
del rows

arcpy.env.workspace = workspace
in_routes_field = "PARENT"
in_table_props = "parent LINE loStation hiStation"
out_routes = "art80_routes_" + str(int(time.time()))
arcpy.MakeRouteEventLayer_lr(street,in_routes_field,route_table,in_table_props,out_routes)

arcpy.CopyFeatures_management(out_routes, out_routes)

input_features = out_routes + ";" + parcel_buffered
route_intersect = "art80_routes_intersected_" + str(int(time.time()))
arcpy.Intersect_analysis(input_features,route_intersect,"ALL","","LINE")

where_clause = """ reptype in ('ARA','ARC','ARP','ARR','TRF','BDR','BPR','BKC','MDT','PIA','PIR','RCA','RCC','RCR',
'OVA','OVC','OVR','SWK') AND WebCategory in ('Board Approved','LOI Submitted','Under Construction','Under Review')"""
# Execute Select
arcpy.Select_analysis(route_intersect, output, where_clause)
print output

# arcpy.TableToExcel_conversion(output,"test_excel")
# print "test_excel"
