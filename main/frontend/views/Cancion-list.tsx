import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import { Button, ComboBox, Dialog, Grid, GridColumn, GridItemModel, NumberField, TextField, VerticalLayout, HorizontalLayout, Icon, Select } from '@vaadin/react-components';
import { Notification } from '@vaadin/react-components/Notification';
import { CancionServices } from 'Frontend/generated/endpoints';
import { useSignal } from '@vaadin/hilla-react-signals';
import handleError from 'Frontend/views/_ErrorHandler';
import { Group, ViewToolbar } from 'Frontend/components/ViewToolbar';

import { useDataProvider } from '@vaadin/hilla-react-crud';
import Cancion from 'Frontend/generated/com/practica2/base/models/Cancion';
import { useEffect, useState } from 'react';

import { GridSortColumn, GridSortColumnDirectionChangedEvent } from '@vaadin/react-components/GridSortColumn';

export const config: ViewConfig = {
  title: 'Canciones',
  menu: {
    icon: 'vaadin:clipboard-check',
    order: 2,
    title: 'Canciones',
  },
};

type CancionEntryFormProps = {
  onCancionCreated?: () => void;
};

function CancionEntryForm(props: CancionEntryFormProps) {
  const nombre = useSignal('');
  const genero = useSignal('');
  const album = useSignal('');
  const duracion = useSignal<string>('');
  const url = useSignal('');
  const tipo = useSignal('');

  const dialogOpened = useSignal(false);

  const createCancion = async () => {
    try {
      const idGeneroNum = parseInt(genero.value || '0');
      const idAlbumNum = parseInt(album.value || '0');
      const duracionNum = parseInt(duracion.value || '0');

      await CancionServices.create(
        nombre.value,
        idGeneroNum,
        duracionNum,
        url.value,
        tipo.value,
        idAlbumNum
      );

      if (props.onCancionCreated) {
        props.onCancionCreated();
      }

      nombre.value = '';
      genero.value = '';
      album.value = '';
      duracion.value = '';
      url.value = '';
      tipo.value = '';
      dialogOpened.value = false;
      Notification.show('Cancion creada con exito', { duration: 5000, position: 'bottom-end', theme: 'success' });

    } catch (error: unknown) {
      console.log(error);
      handleError(error);
      Notification.show((error as Error)?.message || 'Error desconocido al crear la cancion', { duration: 5000, position: 'top-center', theme: 'error' });
    }
  };

  const listaGenero = useSignal<{ label: string, value: string }[]>([]);
  useEffect(() => {
    CancionServices.listGeneroCombo().then(data => {
      listaGenero.value = (data ?? []).map(item => ({
        label: String(item?.label ?? ''),
        value: String(item?.value ?? '')
      }));
    });
  }, []);

  const listaAlbum = useSignal<{ label: string, value: string }[]>([]);
  useEffect(() => {
    CancionServices.listAlbumCombo().then(data => {
      listaAlbum.value = (data ?? []).map(item => ({
        label: String(item?.label ?? ''),
        value: String(item?.value ?? '')
      }));
    });
  }, []);

  const listaTipo = useSignal<string[]>([]);
  useEffect(() => {
    CancionServices.listTipo().then(data =>
      listaTipo.value = (data ?? []).filter((item): item is string => typeof item === 'string')
    );
  }, []);


  return (
    <>
      <Dialog
        modeless
        headerTitle="Nueva Cancion"
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
              Cancelar
            </Button>
            <Button onClick={createCancion} theme="primary">
              Registrar
            </Button>
          </>
        }
      >
        <VerticalLayout style={{ alignItems: 'stretch', width: '18rem', maxWidth: '100%' }}>
          <TextField label="Nombre de la cancion"
            placeholder="Ingrese el nombre de la cancion"
            aria-label="Nombre de la cancion"
            value={nombre.value}
            onValueChanged={(evt) => (nombre.value = evt.detail.value)}
          />
          <ComboBox label="Genero"
            items={listaGenero.value}
            placeholder='Seleccione un genero'
            itemLabelPath="label"
            itemValuePath="value"
            value={genero.value}
            onValueChanged={(evt) => (genero.value = evt.detail.value)}
          />
          <ComboBox label="Album"
            items={listaAlbum.value}
            placeholder='Seleccione un album'
            itemLabelPath="label"
            itemValuePath="value"
            value={album.value}
            onValueChanged={(evt) => (album.value = evt.detail.value)}
          />
          <ComboBox label="Tipo"
            items={listaTipo.value}
            placeholder='Seleccione un tipo de archivo'
            value={tipo.value}
            onValueChanged={(evt) => (tipo.value = evt.detail.value)}
          />
          <NumberField label="Duracion (segundos)"
            placeholder="Ingrese la duracion de la cancion en segundos"
            aria-label="Duracion de la cancion"
            value={duracion.value}
            onValueChanged={(evt) => (duracion.value = evt.detail.value)}
          />
          <TextField label="Link de la cancion (URL)"
            placeholder="Ingrese el link de la cancion"
            aria-label="Link de la cancion"
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

type CancionEntryFormUpdateProps = {
  arguments: Cancion;
  onCancionUpdated?: () => void;
};

function CancionEntryFormUpdate(props: CancionEntryFormUpdateProps): JSX.Element {
  const dialogOpened = useSignal<boolean>(false);

  const nombre = useSignal<string>(props.arguments.nombre ?? '');
  const genero = useSignal<string>(props.arguments.id_genero?.toString() ?? '');
  const album = useSignal<string>(props.arguments.id_album?.toString() ?? '');
  const duracion = useSignal<string>(props.arguments.duracion?.toString() ?? '');
  const url = useSignal<string>(props.arguments.url ?? '');
  const tipo = useSignal<string>(props.arguments.tipo?.toString() ?? '');

  useEffect(() => {
    nombre.value = props.arguments.nombre ?? '';
    genero.value = props.arguments.id_genero?.toString() ?? '';
    album.value = props.arguments.id_album?.toString() ?? '';
    duracion.value = props.arguments.duracion?.toString() ?? '';
    url.value = props.arguments.url ?? '';
    tipo.value = props.arguments.tipo?.toString() ?? '';
  }, [props.arguments]);

  const listaGenero = useSignal<{ label: string, value: string }[]>([]);
  useEffect(() => {
    CancionServices.listGeneroCombo().then(data => {
      listaGenero.value = (data ?? []).map(item => ({
        label: String(item?.label ?? ''),
        value: String(item?.value ?? '')
      }));
    });
  }, []);

  const listaAlbum = useSignal<{ label: string, value: string }[]>([]);
  useEffect(() => {
    CancionServices.listAlbumCombo().then(data => {
      listaAlbum.value = (data ?? []).map(item => ({
        label: String(item?.label ?? ''),
        value: String(item?.value ?? '')
      }));
    });
  }, []);

  const listaTipo = useSignal<string[]>([]);
  useEffect(() => {
    CancionServices.listTipo().then(data =>
      listaTipo.value = (data ?? []).filter((item): item is string => typeof item === 'string')
    );
  }, []);

  const updateCancion = async (): Promise<void> => {
    try {
      const idGeneroNum = parseInt(genero.value || '0');
      const idAlbumNum = parseInt(album.value || '0');
      const duracionNum = parseInt(duracion.value || '0');

      await CancionServices.update(
        props.arguments.id ?? 0,
        nombre.value,
        idGeneroNum,
        duracionNum,
        url.value,
        tipo.value,
        idAlbumNum
      );

      if (props.onCancionUpdated) {
        props.onCancionUpdated();
      }
      dialogOpened.value = false;
      Notification.show('Cancion actualizada con exito', { duration: 5000, position: 'bottom-end', theme: 'success' });
    } catch (error: unknown) {
      console.log(error);
      handleError(error);
      Notification.show((error as Error)?.message || 'Error desconocido al actualizar la cancion', { duration: 5000, position: 'top-center', theme: 'error' });
    }
  };

  return (
    <>
      <Dialog
        modeless
        headerTitle="Actualizar Cancion"
        opened={dialogOpened.value}
        onOpenedChanged={({ detail }: { detail: { value: boolean } }) => {
          dialogOpened.value = detail.value;
        }}
        footer={
          <>
            <Button
              onClick={() => {
                dialogOpened.value = false;
              }}
            >
              Cancelar
            </Button>
            <Button onClick={updateCancion} theme="primary">
              Actualizar
            </Button>
          </>
        }
      >
        <VerticalLayout style={{ alignItems: 'stretch', width: '18rem', maxWidth: '100%' }}>
          <TextField label="Nombre de la cancion"
            placeholder="Ingrese el nombre de la cancion"
            aria-label="Nombre de la cancion"
            value={nombre.value}
            onValueChanged={(evt) => (nombre.value = evt.detail.value)}
          />
          <ComboBox label="Genero"
            items={listaGenero.value}
            placeholder='Seleccione un genero'
            itemLabelPath="label"
            itemValuePath="value"
            value={genero.value}
            onValueChanged={(evt) => (genero.value = evt.detail.value)}
          />
          <ComboBox label="Album"
            items={listaAlbum.value}
            placeholder='Seleccione un album'
            itemLabelPath="label"
            itemValuePath="value"
            value={album.value}
            onValueChanged={(evt) => (album.value = evt.detail.value)}
          />
          <ComboBox label="Tipo"
            items={listaTipo.value}
            placeholder='Seleccione un tipo de archivo'
            value={tipo.value}
            onValueChanged={(evt) => (tipo.value = evt.detail.value)}
          />
          <NumberField label="Duracion (segundos)"
            placeholder="Ingrese la duracion de la cancion en segundos"
            aria-label="Duracion de la cancion"
            value={duracion.value}
            onValueChanged={(evt) => (duracion.value = evt.detail.value)}
          />
          <TextField label="Link de la cancion (URL)"
            placeholder="Ingrese el link de la cancion"
            aria-label="Link de la cancion"
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
        Editar
      </Button>
    </>
  );
}

const dateFormatter = new Intl.DateTimeFormat('es-ES', {
  dateStyle: 'medium',
});

export default function CancionView(): JSX.Element {
  const [items, setItems] = useState<Record<string, unknown>[]>([]);

  const callData = async (): Promise<void> => {
    try {
      const data = await CancionServices.listCancion();
      setItems(
        (data ?? [])
          .filter((item): item is Record<string, string | undefined> => item !== undefined)
          .map(item => ({
            id: (item.id as number | string | undefined) ? parseInt(item.id as string) : undefined,
            nombre: item.nombre as string | undefined,
            id_genero: (item.id_genero as number | string | undefined) ? parseInt(item.id_genero as string) : undefined,
            duracion: (item.duracion as number | string | undefined) ? parseInt(item.duracion as string) : undefined,
            url: item.url as string | undefined,
            tipo: item.tipo as any,
            id_album: (item.id_album as number | string | undefined) ? parseInt(item.id_album as string) : undefined,
            genero: item.genero as string | undefined,
            album: item.album as string | undefined 
          })) as Cancion[]);
    } catch (error) {
      console.error("Error al cargar datos de canciones:", error);
      handleError(error);
      Notification.show('Error al cargar la lista de canciones', { duration: 5000, position: 'top-center', theme: 'error' });
    }
  };

  useEffect(() => {
    callData();
  }, []);

  const order = async (event: GridSortColumnDirectionChangedEvent, columnId: string): Promise<void> => {
    const direction = event.detail.value;
    const dir = (direction === 'asc') ? 1 : 2;

    try {
      let result;
      result = await CancionServices.order(columnId, dir);
      setItems((result ?? []).filter((item): item is Cancion => item !== undefined)
        .map(item => ({
          id: (item.id as number | string | undefined) ? parseInt(item.id as string) : undefined,
          nombre: item.nombre as string | undefined,
          id_genero: (item.id_genero as number | string | undefined) ? parseInt(item.id_genero as string) : undefined,
          duracion: (item.duracion as number | string | undefined) ? parseInt(item.duracion as string) : undefined,
          url: item.url as string | undefined,
          tipo: item.tipo as any,
          id_album: (item.id_album as number | string | undefined) ? parseInt(item.id_album as string) : undefined,
          genero: item.genero as string | undefined,
          album: item.album as string | undefined 
        })) as Cancion[]);
    } catch (error) {
      console.error("Error al ordenar canciones:", error);
      handleError(error);
      Notification.show('Error al ordenar canciones', { duration: 5000, position: 'top-center', theme: 'error' });
    }
  };

  function link({ item }: { item: Cancion }): JSX.Element {
    return (
      <span>
        <CancionEntryFormUpdate arguments={item} onCancionUpdated={callData} />
      </span>
    );
  }

  function index({ model }: { model: GridItemModel<Cancion> }): JSX.Element {
    return (
      <span>
        {model.index + 1}
      </span>
    );
  }

  const criterio = useSignal('');
  const texto = useSignal('');
  const itemSelect = [
    { label: 'Nombre', value: 'nombre' },
    { label: 'Album', value: 'album' }, 
    { label: 'Genero', value: 'genero' }, 
    { label: 'Duracion', value: 'duracion' }, 
    { label: 'Tipo', value: 'tipo' },
  ];

  const search = async (): Promise<void> => {
    try {
      const searchType = 3;

      const result = await CancionServices.search(criterio.value, texto.value, searchType);
      setItems((result ?? []).filter((item): item is Cancion => item !== undefined)
        .map(item => ({
          id: (item.id as number | string | undefined) ? parseInt(item.id as string) : undefined,
          nombre: item.nombre as string | undefined,
          id_genero: (item.id_genero as number | string | undefined) ? parseInt(item.id_genero as string) : undefined,
          duracion: (item.duracion as number | string | undefined) ? parseInt(item.duracion as string) : undefined,
          url: item.url as string | undefined,
          tipo: item.tipo as any,
          id_album: (item.id_album as number | string | undefined) ? parseInt(item.id_album as string) : undefined,
          genero: item.genero as string | undefined,
          album: item.album as string | undefined 
        })) as Cancion[]);

      criterio.value = '';
      texto.value = '';
      Notification.show('Busqueda realizada', { duration: 5000, position: 'bottom-end', theme: 'success' });
    } catch (error) {
      console.error("Error en la busqueda:", error); 
      handleError(error);
      Notification.show('Error al realizar la busqueda', { duration: 5000, position: 'top-center', theme: 'error' });
    }
  };

  const albumBuscado = useSignal('');

  const searchAlbum = async (): Promise<void> => {
    try {
      const result = await CancionServices.searchAlbum(albumBuscado.value);
      setItems((result ?? []).filter((item): item is Cancion => item !== undefined)
        .map(item => ({
          id: (item.id as number | string | undefined) ? parseInt(item.id as string) : undefined,
          nombre: item.nombre as string | undefined,
          id_genero: (item.id_genero as number | string | undefined) ? parseInt(item.id_genero as string) : undefined,
          duracion: (item.duracion as number | string | undefined) ? parseInt(item.duracion as string) : undefined,
          url: item.url as string | undefined,
          tipo: item.tipo as any,
          id_album: (item.id_album as number | string | undefined) ? parseInt(item.id_album as string) : undefined,
          genero: item.genero as string | undefined,
          album: item.album as string | undefined 
        })) as Cancion[]);

      Notification.show('Busqueda por album realizada', { duration: 3000, theme: 'success' }); 
    } catch (e: unknown) {
      console.error("Error en la busqueda por album:", e); // Sin tilde
      handleError(e);
      Notification.show('Error en la busqueda por album', { duration: 3000, theme: 'error' }); 
    }
  };

  return (
    <main className="w-full h-full flex flex-col box-border gap-s p-m">
      <ViewToolbar title="Lista de Canciones">
        <Group>
          <CancionEntryForm onCancionCreated={callData} />
        </Group>
      </ViewToolbar>
      <HorizontalLayout theme="spacing">
        <Select items={itemSelect}
          value={criterio.value}
          onValueChanged={(evt) => (criterio.value = evt.detail.value)}
          placeholder="Seleccione un criterio">
        </Select>

        <TextField
          placeholder="Buscar..."
          style={{ width: '50%' }}
          value={texto.value}
          onValueChanged={(evt) => (texto.value = evt.detail.value)}
        >
          <Icon slot="prefix" icon="vaadin:search" />
        </TextField>
        <Button onClick={search} theme="primary">
          BUSCAR
        </Button>
        <Button onClick={callData} theme="tertiary">
          Mostrar todo
        </Button>
      </HorizontalLayout>
      

      <Grid items={items}>
        <GridColumn header="Nro" renderer={index} />
        <GridSortColumn path="nombre" header="Nombre de la cancion" onDirectionChanged={(e) => order(e, 'nombre')} />
        <GridSortColumn path="album" header="Album" onDirectionChanged={(e) => order(e, 'album')} /> {}
        <GridSortColumn path="genero" header="Genero" onDirectionChanged={(e) => order(e, 'genero')} /> {}
        <GridSortColumn path="url" header="URL" onDirectionChanged={(e) => order(e, 'url')} />
        <GridSortColumn path="duracion" header="Duracion (segundos)" onDirectionChanged={(e) => order(e, 'duracion')} /> {}
        <GridSortColumn path="tipo" header="Tipo de archivo" onDirectionChanged={(e) => order(e, 'tipo')} />
        <GridColumn header="Acciones" renderer={link} />
      </Grid>
    </main>
  );
}