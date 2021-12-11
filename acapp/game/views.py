from django.http import HttpResponse

def index(request):
    line1 = '<h1 style="text-align: center">我的第一个网页</h1>'
    line4 = '<a href="/play/">进入游戏界面</a>'
    line3 = '<hr>'
    line2 = '<img src="https://img2.baidu.com/it/u=4106346850,321390637&fm=26&fmt=auto" width=1880>'
    return HttpResponse(line1 + line4 + line3 + line2)

def play(request):
    line2 = '<img src="https://img1.baidu.com/it/u=903227286,1654182403&fm=26&fmt=auto" width=1880>'
    line3 = '<hr>'
    line4 = '<a href="/">返回主页</a>'
    line1 = '<h1 style="text-align: center">游戏界面</h1>'
    return HttpResponse(line1 + line4 + line3 + line2)
