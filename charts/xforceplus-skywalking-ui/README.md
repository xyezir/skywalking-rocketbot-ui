# Quick start

Skywalking 前端页面工程

## _helpers.tpl

这个文件我们用来进行标签模板的定义，以便在上文提到的位置进行标签渲染。

此项目标签总共分为两个部分: 平台、日志。

### 平台标签

#### deployment 级:

```
{{- define "service.labels.standard" -}}
choerodon.io/release: {{ .Release.Name | quote }}
{{- end -}}
```
平台管理实例需要的实例ID。


### 日志标签

#### deployment 级:

```
{{- define "service.logging.deployment.label" -}}
choerodon.io/logs-parser: {{ .Values.logs.parser | quote }}
{{- end -}}
```
日志管理所需要的应用标签。该标签指定应用程序的日志格式，内置格式有`nginx`,`spring-boot`,`docker`对于前端服务请使用`nginx`，如果不需要收集日志请移除此段代码，并删除模板文件关于`service.logging.deployment.label`的引用。

## values.yaml

这个文件中的键值对，即为我们上文中所引用的变量。

将所以有变量集中在一个文件中，方便部署的时候进行归档以及灵活替换。

同时，helm命令支持使用 `--set FOO_BAR=FOOBAR` 参数对values 文件中的变量进行赋值，可以进一步简化部署流程。
