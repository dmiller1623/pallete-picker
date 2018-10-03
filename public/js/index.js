let projects = [];

const getNewColor = () => {
  let codeOptions = '0123456789ABCDEF'.split('');
  var color = '#'
  for(var i = 0; i < 6; i++) {
    color += codeOptions[Math.round(Math.random() * 15)]
  }
  return color
}

const getNewPalette = () => {
  let colorClasses = ['.color-one', '.color-two', '.color-three', '.color-four', '.color-five']
  colorClasses.forEach(colorClass => {
    if ($(`${colorClass}`).hasClass('locked')) {
      return 
    } else {
      let newColor = getNewColor()
      $(`${colorClass}`).css('background-color', newColor)
      $(`${colorClass}`).children().children('.color-code').text(newColor)
    }
  })
}

const lockColor = (event) => {
  ($(event.target.parentElement.parentElement)).toggleClass('locked')
}

const savePalette = async () => {
  const newPalette = { colors: ['#BC9097', '#EF6789', '#78EEC4', '#9A4567', '#CDB889'] };

  const url = 'http://localhost:3000/api/v1/palettes';
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      newPalette
    })
  })
  // await console.log(response.json())
}

const addNewProject = (event) => {
  event.preventDefault()
  let projectName = $('.project-name').val()
  let newPalette = {
    projectName,
    color_one: $('.code-one').text(),
    color_two: $('.code-two').text(),
    color_three: $('.code-three').text(),
    color_four: $('.code-four').text(),
    color_five: $('.code-five').text(),
  }
  projects.push(newPalette)
  console.log(projects)
  displayProjects(projects)
}

const displayProjects = (projects) => {
  $('.projects-display').text('cbjksdbc')
}

$(document).ready(() =>{
  getNewPalette();
})

$('.save-project-button').on('click', addNewProject)
$('.save-palette-button').on('click', savePalette)
$('.lock-button').on('click', lockColor)
$('.new-palette-button').on('click', getNewPalette)
