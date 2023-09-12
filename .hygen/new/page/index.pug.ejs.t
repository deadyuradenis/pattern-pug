---
to: <%= absPath %>/<%= pageName %>.pug
---
<% if(layoutName) { -%>
extends ../layouts/<%= layoutName %>/index.pug
<% } else {-%>
extends ../layouts/default/index.pug
<% } -%>

block title
  title <%= pageName %>
  
block body
  h1 <%= pageName %>