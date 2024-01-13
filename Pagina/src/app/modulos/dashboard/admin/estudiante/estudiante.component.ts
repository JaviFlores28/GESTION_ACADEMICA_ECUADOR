import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { Estudiante } from 'src/app/interfaces/Estudiante.interface';
import { Usuario } from 'src/app/interfaces/Usuario.interface';
import { getFormattedDate } from 'src/app/sistema/variables/variables';
import { EstudianteService } from 'src/app/servicios/estudiante.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { ModalService } from 'src/app/servicios/modal.service';
import { AutentificacionService } from 'src/app/servicios/autentificacion.service';
import { MyValidators } from 'src/app/utils/validators';
import { ProvinciasService } from 'src/app/servicios/provincias.service';
import { DatosJson, Provincia } from 'src/app/interfaces/Provincias.interface';

@Component({
  selector: 'app-estudiante',
  templateUrl: './estudiante.component.html',
  styleUrls: ['./estudiante.component.scss'],
})
export class EstudianteComponent {


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private usuarioService: UsuarioService,
    private service: EstudianteService,
    private modalService: ModalService,
    private authService: AutentificacionService,
    private provinciasService: ProvinciasService
  ) {
  }
  listProv: any;
  modoEdicion: boolean = false;
  editItemId: string = '';
  modaltitle: string = 'Agregar';
  modalMsg: string = '¿Desea guardar el registro?';
  USR_ID = this.authService.getUserIdLocal();
  icon = faInfoCircle;

  usuarios: Usuario[] = [];

  listEquiposE = [
    { id: 'EST_INTE', nombre: 'Internet', value: 5 },
    { id: 'EST_TV', nombre: 'TV', value: 1 },
    { id: 'EST_RAD', nombre: 'Radio', value: 2 },
    { id: 'EST_PC', nombre: 'Computador', value: 3 },
    { id: 'EST_CEL', nombre: 'Celular', value: 4 },
  ];

  form = this.formBuilder.nonNullable.group({
    EST_DNI: ['', MyValidators.required, MyValidators.validateCedula],
    EST_NOM: ['', MyValidators.required, MyValidators.soloLetras,MyValidators.minLength(3)],
    EST_NOM2: ['', MyValidators.required,MyValidators.soloLetras],
    EST_APE: ['', MyValidators.required, MyValidators.soloLetras],
    EST_APE2: ['', MyValidators.required, MyValidators.soloLetras],
    EST_FECH_NAC: [getFormattedDate(new Date()), MyValidators.required],
    EST_GEN: ['', MyValidators.required],
    EST_PRV: ['', MyValidators.required],
    EST_CAN: ['', MyValidators.required],
    EST_PARR: ['', MyValidators.required],
    EST_DIR: ['', MyValidators.required],
    EST_NAC: ['', MyValidators.required],
    EST_ETN: ['', MyValidators.required],
    EST_NAC_ETN: ['', MyValidators.required],
    EST_COM_ETN: ['', MyValidators.required],
    EST_COD_ELE: ['', MyValidators.required, MyValidators.soloNumeros],
    EST_NEC_ASO_DIS: [false],
    EST_NEC_NO_ASO_DIS: [false],
    EST_ENF_CAT: [false],
    haveConadis: [false],
    EST_NUM_CONA: [''],
    EST_INTE: [false],
    EST_TV: [false],
    EST_RAD: [false],
    EST_PC: [false],
    EST_CEL: [false],
    REPR_ID: ['', MyValidators.required],
    REL_EST_REP: ['', MyValidators.required],
    ESTADO: [true],
  });

  ngOnInit(): void {
    this.validarEdicion();
    this.loadUsuarios();
    this.loadProvincias();
  }

  provincias: string[] =[] ;
  cantones:any[] = []
  async loadProvincias() {
    await this.provinciasService.getAllDataProvincias().subscribe(data => {
      if (data != null) {
        this.listProv = data;
        let i = 1;
        do {
          this.provincias.push(this.listProv[i].provincia);
          i++;
        } while (this.listProv[i+1] != null);
      }
    })    
  }

  validarEdicion() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.modoEdicion = true;
        this.editItemId = id;
        this.modaltitle = 'Editar';
        this.modalMsg = '¿Desea editar el registro?'; this.loadDataEdit();
      } else {
        this.modoEdicion = false;
        this.editItemId = '';
      }
    });
  }

  onSubmit() {
    this.openModal(this.modaltitle, this.modalMsg, 'warning', true);
  }

  crear() {
    if (this.form.valid) {
      const estudiante: Estudiante = this.buildObject();
      this.service.post(estudiante).subscribe({
        next: (value) => {
          this.handleResponse(value);
        },
        error: (error) => this.handleErrorResponse(error),
      });
    } else {
      this.form.markAllAsTouched();
    }
  }

  editar() {
    if (this.form.valid) {
      const estudiante: Estudiante = this.buildObjectEdit();
      this.service.put(estudiante).subscribe({
        next: (value) => {
          this.handleResponse(value);
        },
        error: (error) => this.handleErrorResponse(error),
      });
    } else {
      this.form.markAllAsTouched();
    }
  }

  buildObject() {
    const estudiante: Estudiante = {
      EST_ID: '0',
      EST_DNI: this.form.value.EST_DNI || '',
      EST_NOM: this.form.value.EST_NOM || '',
      EST_NOM2: this.form.value.EST_NOM2 || '',
      EST_APE: this.form.value.EST_APE || '',
      EST_APE2: this.form.value.EST_APE2 || '',
      EST_FECH_NAC: this.form.value.EST_FECH_NAC ? new Date(this.form.value.EST_FECH_NAC) : new Date(),
      EST_GEN: this.form.value.EST_GEN || '',
      EST_PRV: this.form.value.EST_PRV || '',
      EST_CAN: this.form.value.EST_CAN || '',
      EST_PARR: this.form.value.EST_PARR || '',
      EST_DIR: this.form.value.EST_DIR || '',
      EST_NAC: this.form.value.EST_NAC || '',
      EST_ETN: this.form.value.EST_ETN || '',
      EST_NAC_ETN: this.form.value.EST_NAC_ETN || '',
      EST_COM_ETN: this.form.value.EST_COM_ETN || '',
      EST_COD_ELE: this.form.value.EST_COD_ELE || '',
      EST_NEC_ASO_DIS: this.form.value.EST_NEC_ASO_DIS ? 1 : 0,
      EST_NEC_NO_ASO_DIS: this.form.value.EST_NEC_NO_ASO_DIS ? 1 : 0,
      EST_ENF_CAT: this.form.value.EST_ENF_CAT ? 1 : 0,
      EST_NUM_CONA: this.form.value.EST_NUM_CONA || '0',
      EST_INTE: this.form.value.EST_INTE ? 1 : 0,
      EST_TV: this.form.value.EST_TV ? 1 : 0,
      EST_RAD: this.form.value.EST_RAD ? 1 : 0,
      EST_PC: this.form.value.EST_PC ? 1 : 0,
      EST_CEL: this.form.value.EST_CEL ? 1 : 0,
      REPR_ID: this.form.value.REPR_ID || '',
      REL_EST_REP: this.form.value.REL_EST_REP || '',
      ESTADO: this.form.value.ESTADO ? 1 : 0,
    };
    return estudiante;
  }

  buildObjectEdit() {
    const estudiante: Estudiante = {
      EST_ID: this.editItemId,
      EST_DNI: this.form.value.EST_DNI || '',
      EST_NOM: this.form.value.EST_NOM || '',
      EST_NOM2: this.form.value.EST_NOM2 || '',
      EST_APE: this.form.value.EST_APE || '',
      EST_APE2: this.form.value.EST_APE2 || '',
      EST_FECH_NAC: this.form.value.EST_FECH_NAC ? new Date(this.form.value.EST_FECH_NAC) : new Date(),
      EST_GEN: this.form.value.EST_GEN || '',
      EST_PRV: this.form.value.EST_PRV || '',
      EST_CAN: this.form.value.EST_CAN || '',
      EST_PARR: this.form.value.EST_PARR || '',
      EST_DIR: this.form.value.EST_DIR || '',
      EST_NAC: this.form.value.EST_NAC || '',
      EST_ETN: this.form.value.EST_ETN || '',
      EST_NAC_ETN: this.form.value.EST_NAC_ETN || '',
      EST_COM_ETN: this.form.value.EST_COM_ETN || '',
      EST_COD_ELE: this.form.value.EST_COD_ELE || '',
      EST_NEC_ASO_DIS: this.form.value.EST_NEC_ASO_DIS ? 1 : 0,
      EST_NEC_NO_ASO_DIS: this.form.value.EST_NEC_NO_ASO_DIS ? 1 : 0,
      EST_ENF_CAT: this.form.value.EST_ENF_CAT ? 1 : 0,
      EST_NUM_CONA: this.form.value.haveConadis ? this.form.value.EST_NUM_CONA || '0' : '0',
      EST_INTE: this.form.value.EST_INTE ? 1 : 0,
      EST_TV: this.form.value.EST_TV ? 1 : 0,
      EST_RAD: this.form.value.EST_RAD ? 1 : 0,
      EST_PC: this.form.value.EST_PC ? 1 : 0,
      EST_CEL: this.form.value.EST_CEL ? 1 : 0,
      REPR_ID: this.form.value.REPR_ID || '',
      REL_EST_REP: this.form.value.REL_EST_REP || '',
      ESTADO: this.form.value.ESTADO ? 1 : 0,
    };
    return estudiante;
  }

  loadDataEdit() {
    this.service.getById(this.editItemId).subscribe({
      next: (value) => {
        if (value.response) {
          this.llenarForm(value.data);
        } else {
          console.log(value.message);
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  loadUsuarios() {
    this.usuarioService.getEnabled('R').subscribe({
      next: (value) => {
        if (value.response) {
          this.usuarios = value.data;
        } else {
          console.log(value.message);
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  llenarForm(data: Estudiante) {
    this.form.get('EST_DNI')?.setValue(data.EST_DNI);
    this.form.get('EST_NOM')?.setValue(data.EST_NOM);
    this.form.get('EST_NOM2')?.setValue(data.EST_NOM2);
    this.form.get('EST_APE')?.setValue(data.EST_APE);
    this.form.get('EST_APE2')?.setValue(data.EST_APE2);
    this.form.get('EST_FECH_NAC')?.setValue(getFormattedDate(data.EST_FECH_NAC));
    this.form.get('EST_GEN')?.setValue(data.EST_GEN);
    this.form.get('EST_PRV')?.setValue(data.EST_PRV);
    this.form.get('EST_CAN')?.setValue(data.EST_CAN);
    this.form.get('EST_PARR')?.setValue(data.EST_PARR);
    this.form.get('EST_DIR')?.setValue(data.EST_DIR);
    this.form.get('EST_NAC')?.setValue(data.EST_NAC);
    this.form.get('EST_ETN')?.setValue(data.EST_ETN);
    this.form.get('EST_NAC_ETN')?.setValue(data.EST_NAC_ETN);
    this.form.get('EST_COM_ETN')?.setValue(data.EST_COM_ETN);
    this.form.get('EST_COD_ELE')?.setValue(data.EST_COD_ELE);
    this.form.get('EST_NEC_ASO_DIS')?.setValue(data.EST_NEC_ASO_DIS === 1);
    this.form.get('EST_NEC_NO_ASO_DIS')?.setValue(data.EST_NEC_NO_ASO_DIS === 1);
    this.form.get('EST_ENF_CAT')?.setValue(data.EST_ENF_CAT === 1);
    this.form.get('haveConadis')?.setValue(data.EST_NUM_CONA !== '0');
    this.form.get('EST_NUM_CONA')?.setValue(data.EST_NUM_CONA !== '0' ? data.EST_NUM_CONA : '0');
    this.form.get('EST_INTE')?.setValue(data.EST_INTE === 1);
    this.form.get('EST_TV')?.setValue(data.EST_TV === 1);
    this.form.get('EST_RAD')?.setValue(data.EST_RAD === 1);
    this.form.get('EST_PC')?.setValue(data.EST_PC === 1);
    this.form.get('EST_CEL')?.setValue(data.EST_CEL === 1);
    this.form.get('REPR_ID')?.setValue(data.REPR_ID);
    this.form.get('REL_EST_REP')?.setValue(data.REL_EST_REP);
    this.form.get('ESTADO')?.setValue(data.ESTADO === 1);
  }

  openModal(tittle: string, message: string, alertType: string, form: boolean) {
    this.modalService.openModal(tittle, message, alertType, form)
      .then((result) => {
        if (result === 'save' && form) {
          if (this.modoEdicion) {
            this.editar();
          } else {
            this.crear();
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  handleResponse(value: any) {
    if (!value.response) {
      this.openModal('Oops...', 'Ha ocurrido un error intente nuevamente.', 'danger', false);
      console.log(value.message);
    } else {
      if (this.modoEdicion) {
        this.openModal('¡Completado!', value.message, 'success', false);
      } else {
        this.clear();
        this.openModal('¡Completado!', value.message, 'success', false);
      }
    }
  }

  handleErrorResponse(error: any) {
    this.openModal('Oops...', error, 'danger', false);
    console.log(error);
  }

  clear() {
    this.form.reset();
    this.router.navigate(['../'], { relativeTo: this.route });
  }
  
  keyCanton:number=0;

  actualizarCantones(event:any){
    const value = event.target.selectedIndex;
    const can:any[] = this.listProv[value].cantones ;
    this.cantones = [];
    if (can != null) {
      let i = value+'0'+1;
      let index = parseInt(i);
      this.keyCanton = value;
      do {
        this.cantones.push(can[index].canton);
        index++;
      } while (can[index+1] != null);
    }
  }
  /*parroquias:any[] = []
  actualizarParroquia(event: any) {
    const value = event.target.selectedIndex;
    console.log('desde parroquias '+ this.keyCanton+'0'+value+'51');
    this.cantones[value]
    if(this.cantones != null){
      let i = this.keyCanton+'0'+value+'5'+0;
      let j = parseInt(i);
      //console.log('clave de las'+j);
      
    }
  }*/
  }
