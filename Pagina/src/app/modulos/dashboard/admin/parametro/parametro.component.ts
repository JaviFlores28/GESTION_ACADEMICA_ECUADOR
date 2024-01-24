import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Parametro } from 'src/app/interfaces/Parametro.interface';
import { ModalService } from 'src/app/servicios/modal.service';
import { ParametrosService } from 'src/app/servicios/parametros.service';

@Component({
  selector: 'app-parametro',
  templateUrl: './parametro.component.html',
  styleUrls: ['./parametro.component.scss']
})
export class ParametroComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private service: ParametrosService,
    private route: ActivatedRoute,
    private modalService: ModalService,
  ) { }
  modoEdicion: boolean = false;
  elementoId: string = '';
  hasImage: boolean = false;
  modaltitle: string = 'Agregar';
  modalMsg: string = '¿Desea guardar el registro?';

  form = this.formBuilder.group({
    PRMT_NOM: ['', Validators.required],
    PRMT_DESCR: ['', Validators.required],
    PRMT_IMG: [null],
  });

  ngOnInit(): void {
    this.validarEdicion();
  }
  onSubmit() {
    this.openModal(this.modaltitle, this.modalMsg, 'warning', true);
  }

  validarEdicion() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.modoEdicion = true;
        this.elementoId = id;
        this.loadataEdit();
      } else {
        this.modoEdicion = false;
        this.elementoId = '';
      }
    });
  }

  loadataEdit() {
    this.service.getById(this.elementoId).subscribe({
      next: (value) => {
        this.llenarForm(value.data);
      },
      error(err) {
      },
    })
  }

  llenarForm(data: Parametro) {
    this.form.get('PRMT_NOM')?.setValue(data.PRMT_NOM);
    this.form.get('PRMT_DESCR')?.setValue(data.PRMT_DESCR);
    this.hasImage = (data.PRMT_NOM === 'LOGO');
  }

  openModal(tittle: string, message: string, alertType: string, form: boolean) {
    this.modalService.openModal(tittle, message, alertType, form)
      .then((result) => {
        if (result === 'save' && form) {
          if (this.modoEdicion) {
            this.editar();
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  editar() {
    if (this.form.valid) {
      const parametro: Parametro = this.buildObjectEdit();

      this.service.put(parametro).subscribe({
        next: (value) => {
          this.handleResponse(value);
        },
        error: (error) => this.handleErrorResponse(error),
      });
    } else {
      this.form.markAllAsTouched();
    }
  }

  buildObjectEdit() {
    const parametro: Parametro = {
      PRMT_ID: this.elementoId,
      PRMT_NOM: this.form.value.PRMT_NOM || '',
      PRMT_DESCR: this.form.value.PRMT_DESCR || '',
      PRMT_URL_IMG: this.form.value.PRMT_IMG || '',
      ESTADO: 1,
    };
    return parametro;
  }

  handleResponse(value: any) {
    if (!value.response) {
      //'Ha ocurrido un error intente nuevamente.'
      this.openModal('Oops...', value.message, 'danger', false);
      console.log(value.message);
    } else {
      if (this.modoEdicion) {
        this.openModal('¡Completado!', value.message, 'success', false);
      } else {
        this.openModal('¡Completado!', value.message, 'success', false);
        //this.clear();
      }
    }
  }

  handleErrorResponse(error: any) {
    this.openModal('Oops...', error, 'danger', false);
    console.log(error);
  }

  /*  onFileChange(event: any) {
   selectedImage: { fileName: string, fileData: ArrayBuffer | null } | null = null;
 const file = (event.target as HTMLInputElement).files?.[0];
 
   if (file) {
     const reader = new FileReader();
 
     reader.onload = () => {
       // Almacena la información necesaria de la imagen
       this.selectedImage = {
         fileName: file.name,
         fileData: reader.result as ArrayBuffer,
       };
 
       // Llama a la función de vista previa de la imagen
       this.previewImage();
     };
 
     reader.readAsArrayBuffer(file);
   } }
    previewImage() {
   if (this.selectedImage && this.selectedImage.fileData) {
     // Convierte los bytes de la imagen a una URL de datos (data URL)
     const base64Image = btoa(String.fromCharCode(...new Uint8Array(this.selectedImage.fileData)));
     const dataUrl = `data:image/jpeg;base64,${base64Image}`;
     console.log(dataUrl);
 
     // Asigna la URL de datos al atributo src de la etiqueta img
     const imgElement = document.getElementById('previewImg') as HTMLImageElement;
     if (imgElement) {
       // Verifica si ya tiene una fuente antes de asignar
       if (imgElement.src !== dataUrl) {
         imgElement.src = dataUrl;
       }
     }
   }
 } */

}

