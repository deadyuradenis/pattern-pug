const transformStringToCamelCase = require('../../lib/transformStringToCamelCase.js');
const fs = require('fs');

module.exports = {
  prompt: ({ inquirer }) => {
    const questions = [
      {
        type: 'select',
        name: 'category',
        message: 'Which design level?',
        choices: ['component','module','core']
      },
      {
        type: 'input',
        name: 'blockName',
        message: 'What is the component name?'
      },
    ]
    return inquirer
      .prompt(questions)
      .then(answers => {
        const { category, blockName } = answers;
        const getPath = () => {
          switch (category) {
            case 'component':
              return `components`;
          
            case 'module':
              return `modules`;
          
            case 'core':
              return `core/ui`;
          
            default:
              return `components`;
          }
        }
        const path = getPath()
        const absPath = `src/${path}/${blockName}`;
        const blockNameCCStyle = transformStringToCamelCase(blockName);

        return { ...answers, path, absPath, blockName, blockNameCCStyle}
      })
      .then(answers => {
        const { path, blockName } = answers;
        const jsPath = `src/${path}/index.js`;
        const pugPath = `src/${path}/index.pug`;
        const globalStylesPath = `src/core/config/_init.scss`;

        if (!fs.existsSync(jsPath)) {
          fs.open(jsPath, 'a', (err) => {
            if(err) throw err;
          });
        }
        fs.appendFile(jsPath, `import './${blockName}/index.js';\n`, () => {});

        if (!fs.existsSync(pugPath)) {
          fs.open(pugPath, 'a', (err) => {
            if(err) throw err;
          });
        }

        fs.appendFile(pugPath, `include ./${blockName}/index\n`, () => {});

        if (fs.existsSync(globalStylesPath)) {
          var globalStyles = fs.readFileSync(globalStylesPath, (err, data) => {
            if(err) throw err;
            return data;
          });
        }

        return { ...answers, globalStyles}
      })

  }
}
