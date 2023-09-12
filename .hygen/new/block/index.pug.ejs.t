---
to: <%= absPath %>/index.pug
---

mixin <%= blockNameCCStyle %>(props = { classes: [], attrs: {} })
  -
    const baseClasses = ['<%= blockName %>'];
    const mixClasses = Array.isArray(props.classes) ? props.classes : [];

    const requiredAttrs = {
      class: baseClasses.concat(mixClasses),
    };
    const optionalAttrs = props.attrs || {};
    const attrs = Object.assign({}, requiredAttrs, optionalAttrs);

  div&attributes(attrs)
