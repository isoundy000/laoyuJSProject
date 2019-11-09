#!/usr/bin/python  
#-*-coding:utf-8-*-
import  xdrlib ,sys
import xlrd
import json

import shutil
import os


reload(sys)
sys.setdefaultencoding('utf8')

appendFile =  open("rule.json", "w")


def open_excel(file):
	try:
		data = xlrd.open_workbook(file)
		return data
	except Exception,e:
		print str(e)
 

# 
def copyfile (file,path):
    if os.path.isfile(file):
        shutil.copy(file, path)
     	os.remove(file)
    else:
        shutil.copy(file, path)
    	print "copy %s to %s successful"   % (file,path)


def excel_table_byindex(file,colnameindex=0,by_index=0):
	data = open_excel(file)
	table = data.sheets()[by_index]
	nrows = table.nrows #行数
	ncols = table.ncols #列数
	colnames =  table.row_values(colnameindex) #某一行数据 
	list =[]
	print '行数：',nrows,' 列数:',ncols
	for rownum in range(1,nrows):
		row = table.row_values(rownum)
		if row:
			app = {}
			for i in range(len(colnames)):
				# app[colnames[i]] = row[i] 
				app[i] = row[i] 
			list.append(app)
	return list

# def write_rowinfo_to_file(infos):
# 	for info in infos:
# 		print info
		
# 	json_dic1 = json.dumps(infos, ensure_ascii=False)   
# 	print json_dic1
# 	f = open("a.txt", "a")
# 	f.write(json_dic1)
# 	f.write(",\n")

def main(argv):
	# appendFile.write("[\n")
	print argv[1]
	tables = excel_table_byindex(argv[1])
	json_dic1 = json.dumps(tables, ensure_ascii=False,sort_keys=True, indent=4)   
	# print json_dic1
	# for row in tables:
	# 	write_rowinfo_to_file(row.values())

	# appendFile.write("]")

	appendFile.write(json_dic1)

	appendFile.close()

	oldfilename = (os.getcwd() + "/rule.json")

	newfilename = (os.getcwd() + "/" +argv[2])
	print oldfilename
	print newfilename

	os.rename(oldfilename,newfilename)

	savepath = os.path.abspath(os.path.dirname(os.getcwd())+"/resources/data")
	
	print savepath

	copyfile(newfilename,savepath)

	print 'wanfashuoming.xlsx文件解析完成，生成 玩法说明.json 文件，直接复制到RuleLayer.js中 即可生效。'
	sys.exit(0)

if __name__=="__main__":
	main(sys.argv)