---
name: app
description: Use this to make sure you are writing code according to the specs that I desire/expect of you
---

- Use the theme for all styling, no one-off styles unless absolutely necessary or add something to the theme if it's going to become a repeated thing. Small little spacings or whatever outside the theme are fine here and there
- Run lint and formatting every now and then but not every time you make a change, it wastes time
- inline the css() calls in the component JSX (right in the mix prop) unless they are massive or are reused by various areas of the markup
- do all css sizing in rem unless px or another thing is critical
- No comments unless doing library-style jsdoc comments and even then, only if it's a util or something that really needs them
- No barrel index files ANYWHERE
- Component props should alwasy live in an extracted type above the component FN and passed to Handle<>

