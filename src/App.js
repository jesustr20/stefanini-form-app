import React, {useEffect, useState} from 'react';
import './App.css';
import axios from 'axios';
import {makeStyles} from '@material-ui/core/styles';
import {Table, TableContainer, TableHead, TableCell, TableBody, TableRow, Modal, Button, TextField} from '@material-ui/core';
import {Edit, Delete} from '@material-ui/icons';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';

const baseUrl = 'http://localhost:3001/api/v1';

const useStyles = makeStyles((theme) => ({
  modal: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  },
  iconos:{
    cursor: 'pointer'
  }, 
  inputMaterial:{
    width: '100%'
  }
}));

function App() {
  const styles= useStyles();
  const [data, setData] = useState([]);
  const [modalInsertar, setModalInsertar]=useState(false);
  const [modalEditar, setModalEditar]=useState(false);
  const [modalEliminar, setModalEliminar]=useState(false);
  const [labname, setLabname] = useState([]);

  const [datoSeleccionado, setDatoSeleccionada]=useState({
    labname: '',
    productname:'',
    amount: '',
    price: '',
    code: ''
  })

  const handleChangeSelect = (event) => {
    const value = event.target.value;
    const nvalue = typeof value === 'string' ? value : value.value
    setLabname(typeof value === 'string' ? value.split(',') : value);
    setDatoSeleccionada(test =>(
      console.log(test),
      {
      ...test,
      labname: nvalue
    }
    ))
    console.log(nvalue);
    setLabname(event.target.value);
  };

  const handleChange= e =>{
    const {name, value}=e.target;
    setDatoSeleccionada(prevState=>(
      {
      ...prevState,
      [name]: value
    }))
    
    console.log(datoSeleccionado);
  }
  //Solicitar los datos
  const peticionGet = async () => {
    await axios.post(baseUrl+'/labs/search')
      .then(response => {
        setData(response.data);
    })
  }

  const peticionPost=async()=>{
    await axios.post(baseUrl+'/labs', datoSeleccionado)
    .then(response=>{
      setData(data.concat(response.data))
      abrirCerrarModalInsertar()
    })
  }

  const peticionPut=async()=>{
    await axios.put(baseUrl+'/labs/'+datoSeleccionado.id, datoSeleccionado)
    .then(response=>{
      console.log(response.data);
      let dataNueva=data;
      dataNueva.map(product=> {
        if(datoSeleccionado.id===product.id){
          product.labname=datoSeleccionado.labname;
          product.productname=datoSeleccionado.productname;
          product.amount=datoSeleccionado.amount;
          product.price=datoSeleccionado.price;
          product.code=datoSeleccionado.code;
        }
        return product
      })
      setData(dataNueva);
      abrirCerrarModalEditar();
    })
  }

  const peticionDelete=async()=>{
    await axios.delete(baseUrl+'/labs/'+datoSeleccionado.id)
    .then(response=>{
      setData(data.filter(product=>product.id!==datoSeleccionado.id));
      abrirCerrarModalEliminar();
    })
  }

  const abrirCerrarModalInsertar=()=>{
    setModalInsertar(!modalInsertar);
  }

  const abrirCerrarModalEditar=()=>{
    setModalEditar(!modalEditar);
  }

  const abrirCerrarModalEliminar=()=>{
    setModalEliminar(!modalEliminar);
  }

  const seleccionarDato=(producto, caso)=>{
    setDatoSeleccionada(producto);
    (caso==='Editar')?abrirCerrarModalEditar():abrirCerrarModalEliminar()
  }


  useEffect(() => {
    peticionGet();
  },[])

  const laboratorios = [
    {
      id:1,
      name:'genfar'
    },
    {
      id:2,
      name:'gsk'
    },
    {
      id:3,
      name:'hersil'
    },
    {
      id:4,
      name:'farmaindustria'
    }
  ]
  const bodyInsertar=(
    <div className={styles.modal}>
      <h3>Agregar Nuevo Producto</h3>
      <Box width={"140px"}>
        <InputLabel id="demo-simple-select-label">Laboratorio</InputLabel>
        <TextField
          fullWidth
          select
          value={labname}
          onChange={handleChangeSelect}
        >
          <MenuItem value={""}></MenuItem>
          {
            laboratorios.map(lab=>{
              return(
                <MenuItem key={lab.id} value={lab.name}>{lab.name}</MenuItem>
              )
            })
          }
        </TextField>
        
      </Box>
      <br />
      <TextField name="productname" className={styles.inputMaterial} label="Nombre del Producto" onChange={handleChange}/>
      <br />
      <TextField name="amount" type="number" InputProps={{pattern: "[0-9]*", inputProps: {min:0} }} className={styles.inputMaterial} label="Cantidad" onChange={handleChange}/>
      <br />
      <TextField name="price" type="number" InputProps={{pattern: "[0-9]*", inputProps: {min:0} }} className={styles.inputMaterial} label="Precio" onChange={handleChange}/>
      <br />
      <TextField name="code" className={styles.inputMaterial} label="Codigo" onChange={handleChange}/>
      <br /><br />
      <div align="right">
        <Button color="primary" onClick={()=>peticionPost()}>Insertar</Button>
        <Button onClick={()=>abrirCerrarModalInsertar()}>Cancelar</Button>
      </div>
    </div>
  )

  const bodyEditar=(
    <div className={styles.modal}>
      <h3>Editar Producto</h3>
      <Box width={"140px"}>
        <InputLabel id="demo-simple-select-label">Laboratorio</InputLabel>
        <TextField
          fullWidth
          select
          value={datoSeleccionado && datoSeleccionado.labname}
          onChange={handleChangeSelect}
        >
          <MenuItem value={""}></MenuItem>
          {
            laboratorios.map(lab=>{
              return(
                <MenuItem key={lab.id} value={lab.name}>{lab.name}</MenuItem>
              )
            })
          }
        </TextField>
        
      </Box>
      <br />
      <TextField name="productname" className={styles.inputMaterial} label="Nombre del Producto" onChange={handleChange} value={datoSeleccionado && datoSeleccionado.productname}/>
      <br />
      <TextField name="amount" type="number" InputProps={{pattern: "[0-9]*", inputProps: {min:0} }} className={styles.inputMaterial} label="Cantidad" onChange={handleChange} value={datoSeleccionado && datoSeleccionado.amount}/>
      <br />
      <TextField name="price" type="number" InputProps={{pattern: "[0-9]*", inputProps: {min:0} }} className={styles.inputMaterial} label="Precio" onChange={handleChange} value={datoSeleccionado && datoSeleccionado.price}/>
      <br />
      <TextField name="code" className={styles.inputMaterial} label="Codigo" onChange={handleChange} value={datoSeleccionado && datoSeleccionado.code}/>
      <br />
      <br /><br />
      <div align="right">
        <Button color="primary" onClick={()=>peticionPut()}>Editar</Button>
        <Button onClick={()=>abrirCerrarModalEditar()}>Cancelar</Button>
      </div>
    </div>
  )

  const bodyEliminar=(
    <div className={styles.modal}>
      <p>Estás seguro que deseas eliminar el Producto<b>{datoSeleccionado && datoSeleccionado.nombre}</b> ? </p>
      <div align="right">
        <Button color="secondary" onClick={()=>peticionDelete()} >Sí</Button>
        <Button onClick={()=>abrirCerrarModalEliminar()}>No</Button>

      </div>

    </div>
  )

  return (
    <div className="App">
      <br />
        <Button onClick={()=>abrirCerrarModalInsertar()}>Insertar</Button>
      <br /><br />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Laboratorio</TableCell>
              <TableCell>Nombre del Producto</TableCell>
              <TableCell>Cantidad</TableCell>
              <TableCell>Precio</TableCell>
              <TableCell>Codigo</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {data.map(products => (
              <TableRow key={products.id}>
                <TableCell>{products.labname}</TableCell>
                <TableCell>{products.productname}</TableCell>
                <TableCell>{products.amount}</TableCell>
                <TableCell>{products.price}</TableCell>
                <TableCell>{products.code}</TableCell>
                <TableCell>
                  <Edit className={styles.iconos} onClick={()=>seleccionarDato(products, 'Editar')}/>
                  &nbsp;&nbsp;&nbsp;
                </TableCell>
                <TableCell>
                  <Delete className={styles.iconos} onClick={()=>seleccionarDato(products, 'Eliminar')}/>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal
     open={modalInsertar}
     onClose={abrirCerrarModalInsertar}>
        {bodyInsertar}
     </Modal>

     <Modal
     open={modalEditar}
     onClose={abrirCerrarModalEditar}>
        {bodyEditar}
     </Modal>

     <Modal
     open={modalEliminar}
     onClose={abrirCerrarModalEliminar}>
        {bodyEliminar}
     </Modal>
    </div>
  );
}

export default App;
