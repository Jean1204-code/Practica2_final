import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import { Button, ComboBox, DatePicker, Dialog, Grid, GridColumn, GridItemModel, NumberField, TextField, VerticalLayout } from '@vaadin/react-components';
import { Notification } from '@vaadin/react-components/Notification';
import { ArtistaService, CancionServices, TaskService } from 'Frontend/generated/endpoints';
import { useSignal } from '@vaadin/hilla-react-signals';
import handleError from 'Frontend/views/_ErrorHandler';
import { Group, ViewToolbar } from 'Frontend/components/ViewToolbar';

import { useDataProvider } from '@vaadin/hilla-react-crud';
import Artista from 'Frontend/generated/com/practica2/base/models/Artista';
import { useCallback, useEffect, useState } from 'react';

export const config: ViewConfig = {
  title: 'Cancion',
  menu: {
    icon: 'vaadin:clipboard-check',
    order: 1,
    title: 'Cancion',
  },
};


type ArtistaEntryFormProps = {
  onArtistaCreated?: () => void;
};

type ArtistaEntryFormPropsUpdate = ()=> {
  onArtistaUpdated?: () => void;
};
//GUARDAR ARTISTA
function ArtistaEntryForm(props: ArtistaEntryFormProps) {
  const nombre = useSignal('');
  const genero = useSignal('');
  const album = useSignal('');
  const duracion = useSignal('');
  const url = useSignal('');
  const tipo = useSignal('');
  const createArtista = async () => {
    try {
      if (nombre.value.trim().length > 0 && genero.value.trim().length > 0) {
        const id_genero = parseInt(genero.value) +1;
        const id_album = parseInt(album.value) +1;
        await CancionServices.create(nombre.value, id_genero, parseInt(duracion.value), url.value, tipo.value, id_album);
        if (props.onArtistaCreated) {
          props.onArtistaCreated();
        }
       
        nombre.value = '';
        genero.value = '';
        album.value = '';
        duracion.value = '';
        url.value = '';
        tipo.value = '';
        dialogOpened.value = false;
        Notification.show('Cancion creado', { duration: 5000, position: 'bottom-end', theme: 'success' });
      } else {
        Notification.show('No se pudo crear, faltan datos', { duration: 5000, position: 'top-center', theme: 'error' });
      }

    } catch (error) {
      console.log(error);
      handleError(error);
    }
  };
  
  let listaGenero = useSignal<String[]>([]);
  useEffect(() => {
    CancionServices.listaAlbumGenero().then(data =>
      //console.log(data)
      listaGenero.value = (data ?? []).filter((item): item is Record<string, unknown> => item !== undefined)
        .map(item => String(item?.nombre ?? ''))
    );
  }, []);
  let listaAlbum = useSignal<String[]>([]);
  useEffect(() => {
    CancionServices.listaAlbumCombo().then(data =>
      //console.log(data)
      listaAlbum.value = (data ?? []).filter((item): item is Record<string, unknown> => item !== undefined)
        .map(item => String(item?.nombre ?? ''))
    );
  }, []);

  let listaTipo = useSignal<String[]>([]);
  useEffect(() => {
    CancionServices.listTipo().then(data =>
      //console.log(data)
      listaTipo.value = (data ?? []).filter((item): item is string => typeof item === 'string')
    );
  }, []);
  const dialogOpened = useSignal(false);
  return (
    <>
      <Dialog
        modeless
        headerTitle="Nuevo artista"
        opened={dialogOpened.value}
        onOpenedChanged={({ detail }) => {
          dialogOpened.value = detail.value;
        }}
        footer={
          <>
            <Button
              onClick={() => {
                dialogOpened.value = false;
              }}
            >
              Candelar
            </Button>
            <Button onClick={createArtista} theme="primary">
              Registrar
            </Button>
            
          </>
        }
      >
        <VerticalLayout style={{ alignItems: 'stretch', width: '18rem', maxWidth: '100%' }}>
          <TextField label="Nombre del cancion" 
            placeholder="Ingrese el nombre de la cancion"
            aria-label="Nombre del cancion"
            value={nombre.value}
            onValueChanged={(evt) => (nombre.value = evt.detail.value)}
          />
          <ComboBox label="Genero" 
            items={listaGenero.value}
            placeholder='Seleccione un genero'
            aria-label='Seleccione un genero de la lista'
            value={genero.value}
            onValueChanged={(evt) => (genero.value = evt.detail.value)}
            />
            <ComboBox label="Album" 
            items={listaAlbum.value}
            placeholder='Seleccione un album'
            aria-label='Seleccione un album de la lista'
            value={album.value}
            onValueChanged={(evt) => (album.value = evt.detail.value)}
            />
            <ComboBox label="Tipo" 
            items={listaTipo.value}
            placeholder='Seleccione un tipo de archivo'
            aria-label='Seleccione un tipo de archivo de la lista'
            value={tipo.value}
            onValueChanged={(evt) => (tipo.value = evt.detail.value)}
            />
            <NumberField  label="Duracion"
            
            placeholder="Ingrese la Duracion de la cancion"
            aria-label="Nombre la Duracion de la cancion"
            value={duracion.value}
            onValueChanged={(evt) => (duracion.value = evt.detail.value)}
          />
          <TextField label="Link de la cancion" 
            placeholder="Ingrese el link de la cancion"
            aria-label="Nombre el link de la cancion"
            value={url.value}
            onValueChanged={(evt) => (url.value = evt.detail.value)}
          />
        </VerticalLayout>
      </Dialog>
      <Button
            onClick={() => {
              dialogOpened.value = true;
            }}
          >
            Agregar
          </Button>
    </>
  );
}

//GUARDAR ARTISTA
const ArtistaEntryFormUpdate = function(props: ArtistaEntryFormPropsUpdate){//useCallback((props: ArtistaEntryFormPropsUpdate,{ item: art }: { item: Artista }) => {
  console.log(props);
  let pais = useSignal<String[]>([]);
  useEffect(() => {
    ArtistaService.listCountry().then(data =>
      pais.value = (data ?? []).filter((item): item is string => typeof item === 'string')
    );
  }, []);
  const nombre = useSignal(props.arguments.nombres);
  const nacionalidad = useSignal(props.arguments.nacionalidad);
  const createArtista = async () => {
    try {
      if (nombre.value.trim().length > 0 && nacionalidad.value.trim().length > 0) {
        await ArtistaService.aupdateArtista(props.arguments.id, nombre.value, nacionalidad.value);
        if (props.arguments.onArtistaUpdated) {
          props.arguments.onArtistaUpdated();
        }
        nombre.value = '';
        nacionalidad.value = '';
        dialogOpened.value = false;
        Notification.show('Artista creado', { duration: 5000, position: 'bottom-end', theme: 'success' });
      } else {
        Notification.show('No se pudo crear, faltan datos', { duration: 5000, position: 'top-center', theme: 'error' });
      }

    } catch (error) {
      console.log(error);
      handleError(error);
    }
  };
  
  
  const dialogOpened = useSignal(false);
  return (
    <>
      <Dialog
        modeless
        headerTitle="Actualizar artista"
        opened={dialogOpened.value}
        onOpenedChanged={({ detail }) => {
          dialogOpened.value = detail.value;
        }}
        footer={
          <>
            <Button
              onClick={() => {
                dialogOpened.value = false;
              }}
            >
              Candelar
            </Button>
            <Button onClick={createArtista} theme="primary">
              Registrar
            </Button>
            
          </>
        }
      >
        <VerticalLayout style={{ alignItems: 'stretch', width: '18rem', maxWidth: '100%' }}>
          <TextField label="Nombre del artista" 
            placeholder="Ingrese el nombre del artista"
            aria-label="Nombre del artista"
            value={nombre.value}
            onValueChanged={(evt) => (nombre.value = evt.detail.value)}
          />
          <ComboBox label="Nacionalidad" 
            items={pais.value}
            placeholder='Seleccione un pais'
            aria-label='Seleccione un pais de la lista'
            value={nacionalidad.value}
            defaultValue={nacionalidad.value}
            
            
            onValueChanged={(evt) => (nacionalidad.value = evt.detail.value)}
            />
        </VerticalLayout>
      </Dialog>
      <Button
            onClick={() => {
              dialogOpened.value = true;
            }}
          >
            Editar  
          </Button>
    </>
  );
};


//LISTA DE ARTISTAS
export default function CancionView() {
  
  const dataProvider = useDataProvider<Artista>({
    list: async () => {
      const data = await CancionServices.listCancion();
      return (data ?? []).filter(item => item !== undefined) as Artista[];
    },
  });

  function indexLink({ item}: { item: Artista }) {
   
    return (
      <span>
        <ArtistaEntryFormUpdate arguments={item} onArtistaUpdated={dataProvider.refresh}>
          
          </ArtistaEntryFormUpdate> 
      </span>
    );
  }

  function indexIndex({model}:{model:GridItemModel<Artista>}) {
    return (
      <span>
        {model.index + 1} 
      </span>
    );
  }

  return (

    <main className="w-full h-full flex flex-col box-border gap-s p-m">

      <ViewToolbar title="Lista de artista">
        <Group>
          <ArtistaEntryForm onArtistaCreated={dataProvider.refresh}/>
        </Group>
      </ViewToolbar>
      <Grid dataProvider={dataProvider.dataProvider}>
        <GridColumn  renderer={indexIndex} header="Nro" />
        <GridColumn path="nombre" header="Cancion" />
        <GridColumn path="genero" header="Genero"/>
          <GridColumn path="albun" header="Album"></GridColumn>
        
        <GridColumn header="Acciones" renderer={indexLink}/>
      </Grid>
    </main>
  );
}