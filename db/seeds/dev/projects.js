
// exports.seed = function(knex, Promise) {
//   // Deletes ALL existing entries
//   return knex('table_name').del()
//     .then(function () {
//       // Inserts seed entries
//       return knex('table_name').insert([
//         {id: 1, colName: 'rowValue1'},
//         {id: 2, colName: 'rowValue2'},
//         {id: 3, colName: 'rowValue3'}
//       ]);
//     });
// };

exports.seed = function(knex, Promise) {
  return knex('projects').del()
    .then(() => knex('palettes').del())
    .then(() => {
      return Promise.all([
        knex('projects').insert({
          name: 'project one'
        }, 'id')
        .then(project => {
          return knex('palettes').insert({
    project_id: project[0], name: 'palette one', color_one:'#152957', color_two:'#831FAE', color_three:'#98D906', color_four:'#7ADC8F', color_five:'#BD7C3A'
  }, 'id')
        })
        .then(() => console.log('sendededed'))
        .catch(error => console.log(`error ${error}`))
      ])
    })
    .catch(error => console.log(`error ${error}`))
};
