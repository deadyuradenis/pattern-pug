module.exports = {
  prompt: ({ inquirer }) => {
    const questions = [
      {
        type: 'input',
        name: 'layoutName',
        message: 'What is the template name (press enter if default template)?'
      },
      {
        type: 'input',
        name: 'pageName',
        message: 'What is the page name?'
      },
    ]
    return inquirer
      .prompt(questions)
      .then(answers => {
        const { layoutName, pageName, themeName } = answers;
        const path = `pages`;
        const absPath = `src/${path}`;
        return { ...answers, path, absPath, layoutName, pageName, themeName }
      })
  }
};
