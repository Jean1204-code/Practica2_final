import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import { Button, ComboBox, Dialog, Grid, GridColumn, GridItemModel, TextField, VerticalLayout } from '@vaadin/react-components';
import { Notification } from '@vaadin/react-components/Notification';
import { ArtistaService } from 'Frontend/generated/endpoints';
import { useSignal } from '@vaadin/hilla-react-signals';
import handleError from 'Frontend/views/_ErrorHandler';
import { Group, ViewToolbar } from 'Frontend/components/ViewToolbar';
import Artista from 'Frontend/generated/com/practica2/base/models/Artista';
import { useEffect, useState } from 'react';
import { GridSortColumn, GridSortColumnDirectionChangedEvent } from '@vaadin/react-components/GridSortColumn';

export const config: ViewConfig = {
  title: 'Artistas',
  menu: {
    icon: 'vaadin:clipboard-check',
    order: 1,
    title: 'Artistas',
  },
};

interface ArtistaEntryFormProps {
  onArtistaCreated?: () => void;
}

interface ArtistaEntryFormUpdateArguments {
  id: number;
  nombres: string;
  nacionalidad: string;
  onArtistaUpdated?: () => void;
}

interface ArtistaEntryFormUpdateProps {
  arguments: ArtistaEntryFormUpdateArguments;
  onArtistaUpdated?: () => void;
}

function ArtistaEntryForm(props: ArtistaEntryFormProps): JSX.Element {
  const nombre = useSignal<string>('');
  const nacionalidad = useSignal<string>('');
  const createArtista = async (): Promise<void> => {
    try {
      if (nombre.value.trim().length > 0 && nacionalidad.value.trim().length > 0) {
        await ArtistaService.createArtista(nombre.value, nacionalidad.value);
        if (props.onArtistaCreated) {
          props.onArtistaCreated();
        }
        nombre.value = '';
        nacionalidad.value = '';
        dialogOpened.value = false;
        Notification.show('Artista creado', { duration: 5000, position: 'bottom-end', theme: 'success' });
      } else {
        Notification.show('No se pudo crear, faltan datos', { duration: 5000, position: 'top-center', theme: 'error' });
      }

    } catch (error: unknown) {
      console.log(error);
      handleError(error);
    }
  };

  let pais = useSignal<(string | undefined)[]>([]);
  useEffect(() => {
    ArtistaService.listCountry().then((data: (string | undefined)[] | undefined) =>
      pais.value = data ?? []
    );
  }, []);
  const dialogOpened = useSignal<boolean>(false);
  return (
    <>
      <Dialog
        modeless
        headerTitle="Nuevo artista"
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
            onValueChanged={(evt: CustomEvent<{ value: string }>) => (nombre.value = evt.detail.value)}
          />
          <ComboBox label="Nacionalidad"
            items={pais.value}
            placeholder='Seleccione un país'
            aria-label='Seleccione un país de la lista'
            value={nacionalidad.value}
            onValueChanged={(evt: CustomEvent<{ value: string }>) => (nacionalidad.value = evt.detail.value)}
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

const ArtistaEntryFormUpdate = function (props: ArtistaEntryFormUpdateProps): JSX.Element {
  console.log(props);
  let pais = useSignal<string[]>([]);
  useEffect(() => {
    ArtistaService.listCountry().then((data: (string | undefined)[] | undefined) =>
      pais.value = (data ?? []).filter((item): item is string => typeof item === 'string')
    );
  }, []);
  const nombre = useSignal<string>(props.arguments.nombres);
  const nacionalidad = useSignal<string>(props.arguments.nacionalidad);
  const updateArtista = async (): Promise<void> => {
    try {
      if (nombre.value.trim().length > 0 && nacionalidad.value.trim().length > 0) {
        await ArtistaService.aupdateArtista(props.arguments.id, nombre.value, nacionalidad.value);
        if (props.arguments.onArtistaUpdated) {
          props.arguments.onArtistaUpdated();
        }
        nombre.value = '';
        nacionalidad.value = '';
        dialogOpened.value = false;
        Notification.show('Artista actualizado', { duration: 5000, position: 'bottom-end', theme: 'success' });
      } else {
        Notification.show('No se pudo actualizar, faltan datos', { duration: 5000, position: 'top-center', theme: 'error' });
      }

    } catch (error: unknown) {
      console.log(error);
      handleError(error);
    }
  };

  const dialogOpened = useSignal<boolean>(false);
  return (
    <>
      <Dialog
        modeless
        headerTitle="Actualizar artista"
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
            <Button onClick={updateArtista} theme="primary">
              Actualizar
            </Button>
          </>
        }
      >
        <VerticalLayout style={{ alignItems: 'stretch', width: '18rem', maxWidth: '100%' }}>
          <TextField label="Nombre del artista"
            placeholder="Ingrese el nombre del artista"
            aria-label="Nombre del artista"
            value={nombre.value}
            onValueChanged={(evt: CustomEvent<{ value: string }>) => (nombre.value = evt.detail.value)}
          />
          <ComboBox label="Nacionalidad"
            items={pais.value}
            placeholder='Seleccione un país'
            aria-label='Seleccione un país de la lista'
            value={nacionalidad.value}
            defaultValue={nacionalidad.value}
            onValueChanged={(evt: CustomEvent<{ value: string }>) => (nacionalidad.value = evt.detail.value)}
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

export default function ArtistaView(): JSX.Element {
  const [items, setItems] = useState<Artista[]>([]);
  const callData = (): void => {
    console.log("Hola call data");
    ArtistaService.listAll().then(function(data: (Artista | undefined)[] | undefined){
      setItems((data ?? []).filter((item): item is Artista => item !== undefined));
    });
  };
  useEffect(() => {
    callData();
  },[]);
  
  const order = (event: GridSortColumnDirectionChangedEvent, columnId: string): void => {
    console.log(event);
    const direction = event.detail.value;
    console.log(`Sort direction changed for column ${columnId} to ${direction}`);

    var dir = (direction === 'asc') ? 1 : 2;
    const result = ArtistaService.order(columnId, dir);
    if (typeof (result as any)?.then === 'function') {
      (result as unknown as Promise<(Artista | undefined)[] | undefined>).then((data) => {
        setItems((data ?? []).filter((item): item is Artista => item !== undefined));
      });
    } else if (Array.isArray(result)) {
      const typedResult = (result ?? []) as (Artista | undefined)[];
      setItems(typedResult.filter((item): item is Artista => item !== undefined));
    }
  };

  function indexLink({ item }: { item: Artista }): JSX.Element {
  return (
    <span>
      <ArtistaEntryFormUpdate
        arguments={{
          id: item.id ?? 0,
          nombres: item.nombres ?? '',
          nacionalidad: (item.nacionalidad ?? '') as string, 
          onArtistaUpdated: callData
        }}
        onArtistaUpdated={callData}
      />
    </span>
  );
}
  function indexIndex({ model }: { model: GridItemModel<Artista> }): JSX.Element {
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
          <ArtistaEntryForm onArtistaCreated={callData}/>
        </Group>
      </ViewToolbar>
      <Grid items={items}>
        <GridColumn renderer={indexIndex} header="Nro" />
        <GridSortColumn path="nombres" header="Nombre del artista" onDirectionChanged={(e) => order(e, 'nombres')} />
        <GridSortColumn path="nacionalidad" header="Nacionalidad" onDirectionChanged={(e) => order(e, 'nacionalidad')} />
        <GridColumn header="Acciones" renderer={indexLink} />
      </Grid>
    </main>
  );
}