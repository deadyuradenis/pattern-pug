const fs = require('fs');

module.exports = {
  prompt: ({ inquirer }) => {
    const questions = [
      {
        type: 'input',
        name: 'layoutName',
        message: 'What is the template name?'
      },
    ]
    return inquirer
      .prompt(questions)
      .then(answers => {
        const { layoutName } = answers;
        const path = `layouts/${layoutName}`;
        const absPath = `src/${path}`;
        const globalStylesPath = `src/core/config/_init.scss`;

        if (fs.existsSync(globalStylesPath)) {
          var globalStyles = fs.readFileSync(globalStylesPath, (err, data) => {
            if(err) throw err;
            return data;
          });
        }

        return { ...answers, path, absPath, layoutName, globalStyles }
      })
  }
}