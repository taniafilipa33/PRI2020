# HTML Templates
Simple tool to define and reuse snippets of HTML in other files.

`npm i html-templates -g`

## Examples

config.json
```json
{
    "source": "src",
    "templates": "src/templates",
    "output": "out"
}
```

src/templates/nav.html
```html
<nav class="navbar">
    <a href="/">Home</a>
    <a href="/usage">Usage</a>
    <a href="/examples">Examples</a>
    <a href="/about">About</a>
</nav>
```

Use it in some other page

src/index.html
```html
...
<body>
   {include "nav.html"}
   <h1>My Amazing Site</h1>
   ... 
</body>
...
```

You can now run `hcc` to "compile" your site and include
all the templates, which will appear in the output folder.

## All Special Tags

### {include "template.html"}
Inserts the contents of the file inside the templates folder
where you placed the include statement.

### {less "filename.less"}
Compiles the [LESS](http://lesscss.org/) file to `filename.css`
and places a css `<link>` tag where you placed the less
statement.

### {sass "filename.less"}
Compiles the [sass](https://sass-lang.com/) file to `filename.css`
and places a css `<link>` tag where you placed the less
statement.

### {markdown "filename.md"}
Compiles the markdown file and places the contents where you placed
the markdown statement.

## Live Development Server
Type `hcc-server` to start a localhost server on port 8080,
where the site will be live updated when you save a source file.

## Planned Features
- TypeScript Compiling
- Better Error Messages
- Template Variables/Inputs
- Webpack integration