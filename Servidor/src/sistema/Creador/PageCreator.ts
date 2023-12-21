import BaseDatos from '../conexion/BaseDatos';
import Funciones from '../funciones/Funciones';
import { MappedProperty } from '../interfaces/MappedProperty';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import path from 'path';
import EntityCreator from './EntityCreator';

//no son parte del sistema
function generateFormReactive(propertiesData: MappedProperty[]) {
  const excludedProperties = ['USR_ID', 'USR_PSWD'];
  return propertiesData
    .filter((property) => !excludedProperties.includes(property.name) && property.key !== 'PRI')
    .map((property) => {
      if (property.type === 'Date') {
        return `${property.name}: [getFormattedDate(new Date()),Validators.required]`;
      } else if (property.type_old.includes('tinyint')) {
        return `${property.name}: [false,Validators.required]`;
      } else if (property.type === 'number') {
        return `${property.name}: [0,Validators.required]`;
      } else {
        return `${property.name}: ['',Validators.required]`;
      }
    })
    .join(',\n ');
}

function generateFormHTML(propertiesData: MappedProperty[]) {
  const excludedProperties = ['USR_ID', 'USR_PSWD'];
  return propertiesData
    .filter((property) => !excludedProperties.includes(property.name) && property.key !== 'PRI')
    .map((property) => {
      if (property.type === 'Date') {
        return `<div class="col">
          <label for="${property.name}" class="form-label">${property.name}</label>
          <input type="date" id="${property.name}" formControlName="${property.name}" class="form-control">
      </div>`;
      } else if (property.type_old.includes('tinyint')) {
        return `  <div class="col">
          <label for="${property.name}" class="form-label pb-2">${property.name}</label>
          <div class="form-check form-switch">
              <input class="form-check-input" id="${property.name}" type="checkbox" role="switch"
                  formControlName="${property.name}">
          </div>
      </div>`;
      } else if (property.type === 'number') {
        return `<div class="col">
          <label for="${property.name}" class="form-label">${property.name}</label>
          <input type="numvber" id="${property.name}" formControlName="${property.name}" class="form-control">
      </div>`;
      } else {
        return `<div class="col">
          <label for="${property.name}" class="form-label">${property.name}</label>
          <input type="text" id="${property.name}" formControlName="${property.name}" class="form-control">
      </div>`;
      }
    })
    .join('\n ');
}

function generateObjectComponet(propertiesData: MappedProperty[]) {
  const excludedProperties = ['USR_ID', 'USR_PSWD', 'USUARIO', 'ROL_ADMIN', 'ROL_REPR', 'ROL_PRF'];
  return propertiesData
    .filter((property) => !excludedProperties.includes(property.name) && property.key !== 'PRI')
    .map((property) => {
      if (property.type === 'Date') {
        return `${property.name}:this.form.value.${property.name} ? new Date(this.form.value.${property.name}) : new Date()`;
      } else if (property.type_old.includes('tinyint')) {
        return `${property.name}: (this.form.value.${property.name}) ? 1 : 0`;
      } else if (property.type === 'number') {
        return `${property.name}:this.form.value.${property.name}|| 0`;
      } else {
        return `${property.name}:this.form.value.${property.name}|| ''`;
      }
    })
    .join(',\n ');
}

function generateFillFormReactive(propertiesData: MappedProperty[]) {
  const excludedProperties = ['USR_ID', 'USR_PSWD', 'ROL_ADMIN', 'ROL_REPR', 'ROL_PRF'];
  return propertiesData
    .filter((property: { name: string; key: string }) => !excludedProperties.includes(property.name) && property.key !== 'PRI')
    .map((property) => {
      if (property.type === 'Date') {
        return `this.form.get('${property.name}')?.setValue(getFormattedDate(data.${property.name}))`;
      } else if (property.type_old.includes('tinyint')) {
        return `this.form.get('${property.name}')?.setValue((data.${property.name} === 1) ? true : false)`;
      } else {
        return `this.form.get('${property.name}')?.setValue(data.${property.name})`;
      }
    })
    .join(',\n ');
}



async function generateComponentFile(connection: any, tableName: any, primaryKeyColumn: string) {
  const capitalizedTableName = Funciones.stringToCapitalize(tableName);
  const lowercaseTableName = Funciones.stringToCamelCase(tableName);
  const properties = await BaseDatos.getTableInfo(tableName);
  const propertiesData = BaseDatos.mapProperties(properties);

  const content = `
    
    constructor(private ngBootstrap: NgbModal, private route: ActivatedRoute, private router: Router, private formBuilder: FormBuilder, private usuarioService: UsuarioService, private service: ${capitalizedTableName}Service) { }
  
    modoEdicion: boolean = false;
    elementoId: string = '';
    icon = faInfoCircle;
   
    form = this.formBuilder.group({
      ${generateFormReactive(propertiesData)}
    })
  
    ngOnInit(): void {
      this.validarEdicion();    
    }
  
  
    validarEdicion() {
      this.route.paramMap.subscribe(params => {
        const id = params.get('id');
        if (id) {
          this.modoEdicion = true;
          this.elementoId = id;
          this.loadData();
        } else {
          this.modoEdicion = false;
          this.elementoId = '';
        }
      });
    }
  
    onSubmit() {
      this.openConfirmationModal();
    }
  
    crear() {
      if (this.form.valid) {
        const ${lowercaseTableName}: ${capitalizedTableName} = this.buildObject();
        this.service.post(${lowercaseTableName}).subscribe(
          {
            next: (response) => {
              this.handleResponse(response);
            },
            error: (error) => this.handleErrorResponse(error)
          }
        );
      } else {
        this.form.markAllAsTouched();
      }
    }
  
  
    editar() {
      if (this.form.valid) {
        const ${lowercaseTableName}: ${capitalizedTableName} = this.buildObjectEdit();
  
        this.service.put(${lowercaseTableName}).subscribe(
          {
            next: (response) => {
              this.handleResponse(response);
            },
            error: (error) => this.handleErrorResponse(error)
          }
        );
  
      } else {
        this.form.markAllAsTouched();
      }
    }
  
    handleResponse(response: any) {
      if (!response.data) {
        this.openAlertModal('Ha ocurrido un error intente nuevamente.', 'danger');
        console.log(response.message);
      } else {
        if (this.modoEdicion) {
          this.openAlertModal(response.message, 'success');
          console.log(response.message);
        } else {
          this.openAlertModal(response.message, 'success');
          this.form.reset();
          this.router.navigate(['../editar/' + response.data], { relativeTo: this.route });
        }
  
      }
    }
  
    handleErrorResponse(error: any) {
      this.openAlertModal('Ha ocurrido un error intente nuevamente.', 'danger');
      console.log(error);
    }
  
    buildObject() {
      const userId = this.usuarioService.getUserLoggedId();
      const ${lowercaseTableName}: ${capitalizedTableName} = {
        ${primaryKeyColumn}: '0',
        ${generateObjectComponet(propertiesData)},
        CREADOR_ID: userId || ''
       ${tableName === 'usuario' ? ' ROL_PRF: 0,\nROL_REPR: 0,\nROL_ADMIN: 1,' : ''}
      };
      return ${lowercaseTableName};
    }
  
    buildObjectEdit() {
      const ${lowercaseTableName}: ${capitalizedTableName} = {
        ${primaryKeyColumn}: this.elementoId,
        ${generateObjectComponet(propertiesData)},
        CREADOR_ID: '0'
      };
      return ${lowercaseTableName};
    }
  
    loadData() {
      this.service.getById(this.elementoId).subscribe({
        next: (value) => {
          if (value.data) {
            this.llenarForm(value.data);
          } else {
            console.log(value.message);
          }
        },
        error: (error) => {
          console.log(error);
        }
      });
    }
  
  
  llenarForm(data: ${capitalizedTableName}) {
    ${generateFillFormReactive(propertiesData)}
  }
  
  openAlertModal(content: string, alertType: string) {
    const modalRef = this.ngBootstrap.open(ModalComponent);
    modalRef.componentInstance.activeModal.update({ size: 'sm', centered: true });
    modalRef.componentInstance?.activeModal && (modalRef.componentInstance.contenido = content);
    modalRef.componentInstance.icon = (alertType == 'success') ? faCircleCheck : (alertType == 'danger') ? faCircleXmark : faInfoCircle;
    modalRef.componentInstance.color = alertType;
    modalRef.componentInstance.modal = false;
  }
  
  openConfirmationModal() {
    const modalRef = this.ngBootstrap.open(ModalComponent);
    modalRef.componentInstance.activeModal.update({ size: 'sm', centered: true });
  
    // Usa el operador Elvis para asegurarte de que activeModal y contenido estén definidos
    modalRef.componentInstance?.activeModal && (modalRef.componentInstance.contenido = (!this.modoEdicion) ? '¿Desea guardar el registro?' : '¿Desea editar el registro?');
    modalRef.componentInstance.icon = faInfoCircle;
    modalRef.componentInstance.color = 'warning';
    modalRef.result.then((result) => {
      if (result === 'save') {
        if (this.modoEdicion) {
          this.editar();
        } else {
          this.crear();
        }
      }
    }).catch((error) => {
      console.log(error);
    });
  }
  `;

  const carpeta = path.join(__dirname, 'Componentes');
  const archivo = path.join(carpeta, `${capitalizedTableName}.ts`);

  if (!existsSync(carpeta)) {
    mkdirSync(carpeta, { recursive: true });
  }
  writeFileSync(archivo, content, 'utf8');
}

async function generateHTMLFile(connection: any, tableName: any) {
  const capitalizedTableName = Funciones.stringToCapitalize(tableName);
  const lowercaseTableName = Funciones.stringToCamelCase(tableName);
  const properties = await BaseDatos.getTableInfo(tableName);
  const propertiesData = BaseDatos.mapProperties(properties);

  const content = `${generateFormHTML(propertiesData)}`;
  const carpeta = path.join(__dirname, 'html');
  const archivo = path.join(carpeta, `${capitalizedTableName}.html`);

  if (!existsSync(carpeta)) {
    mkdirSync(carpeta, { recursive: true });
  }
  writeFileSync(archivo, content, 'utf8');
}
