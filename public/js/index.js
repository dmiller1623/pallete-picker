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

const getPalettes = async () => {
  const response = await fetch('/api/v1/palettes')
  const palettes = await response.json();
  return palettes
}
const displayProjects = async () => {
  const projectDisplay = $('.projects-nav')
  projectDisplay.empty();
  const response = await fetch('/api/v1/projects')
  const projects = await response.json()
  const palettes = await getPalettes();
  const projectsAndPalettes = projects.map(project => {
    const orderedPalettes = palettes.filter(palette => {
      return palette.project_id === project.id
    })
    return {...project, palettes: orderedPalettes}
  })
  console.log(projectsAndPalettes)
  projectsAndPalettes.forEach(project => {
    projectDisplay.append(`
    <div class='database-projects=header'>
      <h1>${project.name}</h1>
    </div>
    `)
    project.palettes.forEach(palette => {
      console.log(palette)
      projectDisplay.append(`
      <div class='database-palettes'>
        <section class='data-color-one' style=background-color:${palette.color_one}></section>
        <section class='data-color-two' style=background-color:${palette.color_two}></section>
        <section class='data-color-three' style=background-color:${palette.color_three}></section>
        <section class='data-color-four' style=background-color:${palette.color_four}></section>
        <section class='data-color-five' style=background-color:${palette.color_five}></section>
      </div>
      `)
    })
  })
}

const addNewProject = async () => {
  let projectName = {name: $('.project-name').val()};
  try {
    const response = await fetch('/api/v1/projects', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...projectName
      })
    });
    displayProjects(projects)
    return await response.json()
  } catch (error) {
    throw new Error(error.message)
  }
  
}

const addNewPalette = async () => {
  let newPalette = {
    name: $('.palette-name').val(),
    color_one: $('.code-one').text(),
    color_two: $('.code-two').text(),
    color_three: $('.code-three').text(),
    color_four: $('.code-four').text(),
    color_five: $('.code-five').text(),
  }
  console.log(newPalette)
  try {
    const response = await fetch('/api/v1/projects/11/palettes', {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...newPalette
      })
    });
    displayProjects();
    return await response.json()
    // if (response.status !==201) {
    //   alert('palette name already exsists')
    // } else {
    //   console.log(response.json())
    //   return await response.json();
    // }
  } catch (error) {
    throw new Error(error.message);
  }
};

$(document).ready(() =>{
  getNewPalette();
  displayProjects();
})

$('.save-project-button').on('click', addNewProject)
$('.save-palette-button').on('click', addNewPalette)
$('.lock-button').on('click', lockColor)
$('.new-palette-button').on('click', getNewPalette)

