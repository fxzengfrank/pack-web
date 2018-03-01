# xpack-web

##使用方法
1. 安装python的tornado库<br>
   pip install tornado<br>
2. 启动web server<br>
   python main.py<br>
3. 打开页面<br>
   浏览器访问http://127.0.0.1:9080/<br>
4. 通过API接口刷新页面<br>
   curl http://127.0.0.1:9080/api<br>

##页面说明
页面使用vue.js构建前后端分离的当页面web应用，初始加载page2组件，可通过页面中的2个button切换所加载的组件，通过API接口方式访问将触发页面加载page1组件。
