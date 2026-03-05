import requests

def main():
    url = 'http://localhost:8080/vendors/create'
    with open(r'c:\Users\omi\Desktop\fms\kbbks-fms-frontend\public\default.png','rb') as f:
        files = {'logo':('default.png', f, 'image/png')}
        data = {'name':'ScriptVendor','description':'via script','active':1}
        r = requests.post(url, data=data, files=files)
        print('status', r.status_code)
        print(r.text)

if __name__ == '__main__':
    main()
