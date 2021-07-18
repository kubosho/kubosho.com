---
name: 'entry'
root: '.'
output: 'entries/2021'
ignore: []
questions:
  # Shortest syntax, using `input` prompt.
  key1: 'Message'

  # Using `input` prompt.
  key2:
    message: 'Message'

  # Using `input` prompt, with default value.
  key3:
    message: 'Message'
    initial: 'Initial Value'

  # Using `list` prompt.
  key4:
    message: 'Message'
    choices: ['A', 'B', 'C']
---

# `{{ inputs.value }}.md`

```markdown
---
title: ブログ v5.0.0
created_at: 2021-01-17 21:42:00
categories: 技術
tags: ブログ
---
```
