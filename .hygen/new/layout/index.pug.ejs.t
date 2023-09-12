---
to: <%= absPath %>/index.pug
---
include ../../core/ui/index
include ../../components/index
include ../../modules/index

doctype html
html.html(lang="ru")
  head
    meta(charset="UTF-8")
    meta(http-equiv="X-UA-Compatible", content="IE=edge")
    meta(name="viewport", content="width=device-width, initial-scale=1.0")
    block title

  body.body
    block body