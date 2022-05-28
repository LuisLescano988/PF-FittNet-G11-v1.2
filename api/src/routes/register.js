const { Router } = require('express');
const Users = require('../models/User')
const { findUser, findAllUsers, createUser, deleteUser } = require('../controlers/users')

// const cookieparser = require('cookie-parser');
const router = Router();
// router.use(cookieparser()); // veremos


// Este array simula ser la base de datos a consultar.
// Queda pendiente hacer las consultas directamente a la base de datos.

// Le podrías cargar esta info de entrada para que todos podamos consultar


// const users = [
//     {id: 1, name: 'Franco', email: 'Franco@mail.com', password: '1234', type: 'user'},
//     {id: 2, name: 'Nano', email: 'Nano@mail.com', password: '1234', type: 'user', avatar: '4'},
//     {id: 3, name: 'Toni', email: 'Toni@mail.com', password: '1234', type: 'partner'},
//     {id: 4, name: 'Jessi', email: 'Jessi@mail.com', password: '1234', type: 'admin'}
// ]

// Esta función simula la busquda del correo en la base de datos para 
// intentar encontrar el usuario con ese correo.
// Queda pendiente utilizar mongose para hacer la consulta
// y enviar la función a controller.

router.findByUsername = function(username, cb) {
      return new Promise(function (resolve, reject) {
      
      // Hay que hacer la consulta a la BD de mongose  

      let user = findUser(username)

      console.log(user, ' linea 18 de register')

      if (user) {
        console.log(user, ' cómo devuelve la promesa a user 20')
        return resolve(user);
      }
      
      return reject(null);
    });
}

// Esta función simula la busquda por id en la base de datos para 
// intentar encontrar el usuario con ese correo.
// Queda pendiente utilizar mongose para hacer la consulta
// y enviar la función a controller.

router.findById = function(_id, cb) {
  console.log(id, 'llegó el id 30 register')

  return new Promise(function (resolve, reject) {

     // Hay que hacer la consulta a la BD de mongose  

    let user = findUser(_id)
    
    if (user) {
      (user, ' cómo devuelve la promesa a user 34')
      return resolve(user);
    }
    
    return reject(null);
  });

}

// Esta función evalua si estoy autenticado, es decir si tengo una sesión
// activa, y si la tengo no me deja continuar con el post a /api/register,
// solo me deja hacerlo si no tengo una sesión iniciada.
function isAuthenticated(req, res, next) {
  if(req.isAuthenticated()) {
    res.redirect('/api/register');
  } else {
    next();
  }
}

// Esta ruta get responde cuando un usuario con sesión activa intenta
// hacer un post a /api/register.
router.get('/register', (req, res, next) => {
    res.send('No puede realizar un post /register mientras su sesión esté iniciada');
    
})


// Esta ruta post recibe request para crear nuevos usuarios en la base de datos.

router.post('/register', isAuthenticated, async (req, res, next) => {
    
  //También debería recibir tipo de usuario "client" o "partner"
  const { name, email, password, type } = req.body;

  console.log(req.body, 'lo que llega por body')
  
  if ( !name || !email || !password || !type ) {
      return res.send('campos incompletos');
  }
  if ( name && email && password && type ) {

     // Hay que hacer la consulta a la BD de mongose  

    let findUser = await Users.find({ userName: email })
    // Acá iría a buscar el email del user en la db

    // let id = users.length + 1 ; // Genero un id
    console.log(findUser._id)
    if (findUser._id) { // Si el correo ya existe
      console.log('El nombre de usuario ya existe o es incorrecto, por favor indique otro username');
      return  res.send('El nombre de usuario ya existe o es incorrecto, por favor indique otro username');
      
    } else { // Si no el correo en bd, lo creo el usuario

       // Hay que hacer la consulta a la BD de mongose  

      const newUser = await createUser({ 
        name: name,
        userName: email,
        password: password,
        type: type
      }); 
      // Acá debería crear el user en la db
      // y retornar un mensaje de usuario creado con éxito
      // por ahora devuelvo el user creado
      console.log(newUser)
      res.status(200).json(newUser)
    }        

   } else {
    
    res.status(404).send('Datos incompletos, el registro no fue creado ');
      
  }

  //---- CUIDADO OJO ---- ruta para borrar usuarios

  router.delete('/api/user/delete/:id', isAuthenticated, async (req, res, next) => {
    const {id} = req.params;
    const response = deleteUser(id);
    console.log(response)
    res.send(response)
  })

})



module.exports = router;

