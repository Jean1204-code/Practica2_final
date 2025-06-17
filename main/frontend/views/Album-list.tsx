import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import { Button, ComboBox, DatePicker, Dialog, Grid, GridColumn, GridItemModel, TextField, VerticalLayout } from '@vaadin/react-components';
import { Notification } from '@vaadin/react-components/Notification';

import { useSignal } from '@vaadin/hilla-react-signals';
import handleError from 'Frontend/views/_ErrorHandler';
import { Group, ViewToolbar } from 'Frontend/components/ViewToolbar';

import { useDataProvider } from '@vaadin/hilla-react-crud';
import Album from 'Frontend/generated/com/practica2/base/models/Album';
import { AlbumServices } from 'Frontend/generated/endpoints';
import { useEffect, useState } from 'react';

export const config: ViewConfig = {
  title: 'Album',
  menu: {
    icon: 'vaadin:clipboard-check',
    order: 4,
    title: 'Album',
  },
};

type AlbumEntryFormProps = {
  onAlbumCreated?: () => void;
};

function AlbumEntryForm(props: AlbumEntryFormProps): JSX.Element {
  const dialogOpened = useSignal<boolean>(false);

  const nombre = useSignal<string>('');
  const fecha = useSignal<string>('');
  const banda = useSignal<string>('');

  const createAlbum = async (): Promise<void> => {
    try {
      const idBandaNum = parseInt(banda.value || '0');

      await AlbumServices.create(
        nombre.value,
        fecha.value,
        idBandaNum
      );
      if (props.onAlbumCreated) {
        props.onAlbumCreated();
      }
      nombre.value = '';
      fecha.value = '';
      banda.value = '';
      dialogOpened.value = false;
      Notification.show('Album creado con exito', { duration: 5000, position: 'bottom-end', theme: 'success' });
    } catch (error: unknown) {
      console.log(error);
      handleError(error);
      Notification.show((error as Error)?.message || 'Error desconocido al crear el album', { duration: 5000, position: 'top-center', theme: 'error' });
    }
  };

  const listaBanda = useSignal<{ label: string, value: string }[]>([]);
  useEffect(() => {
    AlbumServices.listBandaCombo().then(data => {
      listaBanda.value = (data ?? []).map(item => ({
        label: String(item?.label ?? ''),
        value: String(item?.value ?? '')
      }));
    });
  }, []);

  return (
    <>
      <Dialog
        modeless
        headerTitle="Nuevo Album"
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
            <Button onClick={createAlbum} theme="primary">
              Registrar
            </Button>
          </>
        }
      >
        <VerticalLayout style={{ alignItems: 'stretch', width: '18rem', maxWidth: '100%' }}>
          <TextField label="Nombre del Album"
            placeholder="Ingrese el nombre del album"
            aria-label="Nombre del Album"
            value={nombre.value}
            onValueChanged={(evt) => (nombre.value = evt.detail.value)}
          />
          <DatePicker
            label="Fecha de creacion"
            placeholder="Seleccione una fecha"
            aria-label="Seleccione una fecha"
            value={fecha.value}
            onValueChanged={(evt) => (fecha.value = evt.detail.value)}
          />
          <ComboBox label="Banda"
            items={listaBanda.value}
            placeholder='Seleccione la Banda'
            itemLabelPath="label"
            itemValuePath="value"
            value={banda.value}
            onValueChanged={(evt) => (banda.value = evt.detail.value)}
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

type AlbumEntryFormUpdateProps = {
  arguments: Album;
  onAlbumUpdated?: () => void;
};

function AlbumEntryFormUpdate(props: AlbumEntryFormUpdateProps): JSX.Element {
  const dialogOpened = useSignal<boolean>(false);

  const nombre = useSignal<string>(props.arguments.nombre ?? '');
  const fecha = useSignal<string>(props.arguments.fecha ? new Date(props.arguments.fecha as string).toISOString().split('T')[0] : '');
  const banda = useSignal<string>(props.arguments.id_banda?.toString() ?? '');

  useEffect(() => {
    nombre.value = props.arguments.nombre ?? '';
    fecha.value = props.arguments.fecha ? new Date(props.arguments.fecha as string).toISOString().split('T')[0] : '';
    banda.value = props.arguments.id_banda?.toString() ?? '';
  }, [props.arguments]);

  const listaBanda = useSignal<{ label: string, value: string }[]>([]);
  useEffect(() => {
    AlbumServices.listBandaCombo().then(data => {
      listaBanda.value = (data ?? []).map(item => ({
        label: String(item?.label ?? ''),
        value: String(item?.value ?? '')
      }));
    });
  }, []);

  const updateAlbum = async (): Promise<void> => {
    try {
      const idBandaNum = parseInt(banda.value || '0');

      await AlbumServices.update(
        props.arguments.id ?? 0,
        nombre.value,
        fecha.value,
        idBandaNum
      );

      if (props.onAlbumUpdated) {
        props.onAlbumUpdated();
      }
      dialogOpened.value = false;
      Notification.show('Album actualizado con exito', { duration: 5000, position: 'bottom-end', theme: 'success' });
    } catch (error: unknown) {
      console.log(error);
      handleError(error);
      Notification.show((error as Error)?.message || 'Error desconocido al actualizar el album', { duration: 5000, position: 'top-center', theme: 'error' });
    }
  };

  return (
    <>
      <Dialog
        modeless
        headerTitle="Actualizar Album"
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
            <Button onClick={updateAlbum} theme="primary">
              Actualizar
            </Button>
          </>
        }
      >
        <VerticalLayout style={{ alignItems: 'stretch', width: '18rem', maxWidth: '100%' }}>
          <TextField label="Nombre del Album"
            placeholder="Ingrese el nombre del album"
            aria-label="Nombre del Album"
            value={nombre.value}
            onValueChanged={(evt) => (nombre.value = evt.detail.value)}
          />
          <DatePicker
            label="Fecha de creacion"
            placeholder="Seleccione una fecha"
            aria-label="Seleccione una fecha"
            value={fecha.value}
            onValueChanged={(evt) => (fecha.value = evt.detail.value)}
          />
          <ComboBox label="Banda"
            items={listaBanda.value}
            placeholder='Seleccione la Banda'
            itemLabelPath="label"
            itemValuePath="value"
            value={banda.value}
            onValueChanged={(evt) => (banda.value = evt.detail.value)}
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

export default function AlbumView(): JSX.Element {
  const [items, setItems] = useState<Record<string, unknown>[]>([]);

  const callData = async (): Promise<void> => {
    try {
      const data = await AlbumServices.listAlbum();
      setItems(
        (data ?? [])
          .filter((item): item is Record<string, string | undefined> => item !== undefined)
          .map(item => ({ ...item } as Record<string, unknown>))
      );
    } catch (error) {
      console.error("Error al cargar datos de albumes:", error);
      handleError(error);
      Notification.show('Error al cargar la lista de albumes', { duration: 5000, position: 'top-center', theme: 'error' });
    }
  };

  useEffect(() => {
    callData();
  }, []);

  function link({ item }: { item: Record<string, unknown> }): JSX.Element {
    const albumItem: Album = {
      id: item.id as number | undefined,
      nombre: item.nombre as string | undefined,
      fecha: item.fecha as string | undefined,
      id_banda: item.id_banda as number | undefined
    };
    return (
      <span>
        <AlbumEntryFormUpdate arguments={albumItem} onAlbumUpdated={callData} />
      </span>
    );
  }

  function index({ model }: { model: GridItemModel<Record<string, unknown>> }): JSX.Element {
    return (
      <span>
        {model.index + 1}
      </span>
    );
  }

  return (
    <main className="w-full h-full flex flex-col box-border gap-s p-m">
      <ViewToolbar title="Lista de Albumes">
        <Group>
          <AlbumEntryForm onAlbumCreated={callData} />
        </Group>
      </ViewToolbar>
      <Grid items={items}>
        <GridColumn header="Nro" renderer={index} />
        <GridColumn path="nombre" header="Nombre del Album" />
        <GridColumn path="Banda" header="Banda" />
        <GridColumn path="fecha" header="Fecha">
          {({ item }) => {
            const fecha = new Date(item.fecha as string || '');
            return isNaN(fecha.getTime()) ? 'Fecha invalida' : dateFormatter.format(fecha);
          }}
        </GridColumn>
        <GridColumn header="Acciones" renderer={link} />
      </Grid>
    </main>
  );
}