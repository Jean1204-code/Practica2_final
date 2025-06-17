import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import { Button, Dialog, Grid, GridColumn, GridItemModel, TextField, VerticalLayout } from '@vaadin/react-components';
import { Notification } from '@vaadin/react-components/Notification';
import { GeneroServices } from 'Frontend/generated/endpoints';
import { useSignal } from '@vaadin/hilla-react-signals';
import handleError from 'Frontend/views/_ErrorHandler';
import { Group, ViewToolbar } from 'Frontend/components/ViewToolbar';

import { useDataProvider } from '@vaadin/hilla-react-crud';
import Genero from 'Frontend/generated/com/practica2/base/models/Genero';
import { useEffect } from 'react';

export const config: ViewConfig = {
  title: 'Generos',
  menu: {
    icon: 'vaadin:clipboard-check',
    order: 3,
    title: 'Generos',
  },
};

type GeneroEntryFormProps = {
  onGeneroCreated?: () => void;
};

function GeneroEntryForm(props: GeneroEntryFormProps): JSX.Element {
  const dialogOpened = useSignal<boolean>(false);
  const nombre = useSignal<string>('');

  const createGenero = async (): Promise<void> => {
    try {
      if (nombre.value.trim().length > 0) {
        await GeneroServices.create(nombre.value);
        if (props.onGeneroCreated) {
          props.onGeneroCreated();
        }
        nombre.value = '';
        dialogOpened.value = false;
        Notification.show('Género creado con éxito', { duration: 5000, position: 'bottom-end', theme: 'success' });
      } else {
        Notification.show('No se pudo crear: el nombre del género no puede estar vacío', { duration: 5000, position: 'top-center', theme: 'error' });
      }
    } catch (error: unknown) {
      console.log(error);
      handleError(error);
      Notification.show((error as Error)?.message || 'Error desconocido al crear el género', { duration: 5000, position: 'top-center', theme: 'error' });
    }
  };

  return (
    <>
      <Dialog
        modeless
        headerTitle="Nuevo Género"
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
            <Button onClick={createGenero} theme="primary">
              Registrar
            </Button>
          </>
        }
      >
        <VerticalLayout style={{ alignItems: 'stretch', width: '18rem', maxWidth: '100%' }}>
          <TextField label="Nombre del Género"
            placeholder="Ingrese el nombre del género"
            aria-label="Nombre del Género"
            value={nombre.value}
            onValueChanged={(evt: CustomEvent<{ value: string }>) => (nombre.value = evt.detail.value)}
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


type GeneroEntryFormUpdateProps = {
  arguments: Genero;
  onGeneroUpdated?: () => void;
};

// Actualizar Genero
function GeneroEntryFormUpdate(props: GeneroEntryFormUpdateProps): JSX.Element {
  const dialogOpened = useSignal<boolean>(false);
  const nombre = useSignal<string>(props.arguments.nombre ?? '');
  const id = useSignal<number>(props.arguments.id ?? 0);
  useEffect(() => {
    nombre.value = props.arguments.nombre ?? '';
    id.value = props.arguments.id ?? 0;
  }, [props.arguments.nombre, props.arguments.id]);


  const updateGenero = async (): Promise<void> => {
    try {
      if (nombre.value.trim().length > 0 && id.value > 0) {
        await GeneroServices.update(id.value, nombre.value);
        if (props.onGeneroUpdated) {
          props.onGeneroUpdated();
        }
        dialogOpened.value = false;
        Notification.show('Género actualizado con éxito', { duration: 5000, position: 'bottom-end', theme: 'success' });
      } else {
        Notification.show('No se pudo actualizar: faltan datos o ID inválido', { duration: 5000, position: 'top-center', theme: 'error' });
      }
    } catch (error: unknown) {
      console.log(error);
      handleError(error);
      Notification.show((error as Error)?.message || 'Error desconocido al actualizar el género', { duration: 5000, position: 'top-center', theme: 'error' });
    }
  };

  return (
    <>
      <Dialog
        modeless
        headerTitle="Actualizar Género"
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
            <Button onClick={updateGenero} theme="primary">
              Actualizar
            </Button>
          </>
        }
      >
        <VerticalLayout style={{ alignItems: 'stretch', width: '18rem', maxWidth: '100%' }}>
          <TextField label="Nombre del Género"
            placeholder="Ingrese el nuevo nombre del género"
            aria-label="Nombre del Género"
            value={nombre.value}
            onValueChanged={(evt: CustomEvent<{ value: string }>) => (nombre.value = evt.detail.value)}
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


export default function GeneroListView(): JSX.Element {
  const dataProvider = useDataProvider<Genero>({
    list: async () => {

      const data = await GeneroServices.listGenero();
      return (data ?? []).filter((item) => item !== undefined).map(item => ({
        id: (item.id as number | string | undefined) ? parseInt(item.id as string) : undefined,
        nombre: item.nombre as string | undefined
      })) as Genero[];
    },
  });


  function link({ item }: { item: Genero }): JSX.Element {
    return (
      <span>
        <GeneroEntryFormUpdate arguments={item} onGeneroUpdated={dataProvider.refresh} />
      </span>
    );
  }

  function index({ model }: { model: GridItemModel<Genero> }): JSX.Element {
    return (
      <span>
        {model.index + 1}
      </span>
    );
  }

  return (
    <main className="w-full h-full flex flex-col box-border gap-s p-m">
      <ViewToolbar title="Lista de Géneros">
        <Group>
          <GeneroEntryForm onGeneroCreated={dataProvider.refresh} />
        </Group>
      </ViewToolbar>
      <Grid dataProvider={dataProvider.dataProvider}>
        <GridColumn header="Nro" renderer={index} />
        <GridColumn path="nombre" header="Nombre del Género" />
        <GridColumn header="Acciones" renderer={link} />
      </Grid>
    </main>
  );
}