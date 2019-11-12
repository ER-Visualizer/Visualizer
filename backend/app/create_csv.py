from random import randint
import datetime
import csv

counter = 0 
with  open("test_file.csv","w") as f:
    writer = csv.writer(f)
    first_row =  ["patient_id","times","patient_acuity"]
    writer.writerow(first_row)
    delta = datetime.timedelta(minutes=5)
    time_now = datetime.datetime.now()

    while(counter < 20000):
        patient_id = counter
        acuity = randint(1,5)
        time_now += delta
        row = [patient_id, time_now.strftime('%Y-%m-%d %H:%M:%S'), acuity]
        writer.writerow(row)
        counter+=1
