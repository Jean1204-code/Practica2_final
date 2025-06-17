import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import { Button, DatePicker, Dialog, Grid, GridColumn, GridItemModel, TextField, VerticalLayout } from '@vaadin/react-components';
import { Notification } from '@vaadin/react-components/Notification';
import { useSignal } from '@vaadin/hilla-react-signals';
import handleError from 'Frontend/views/_ErrorHandler';
import { Group, ViewToolbar } from 'Frontend/components/ViewToolbar';
import Banda from 'Frontend/generated/com/practica2/base/models/Banda';
import { BandaService } from 'Frontend/generated/endpoints';
import { useEffect, useState } from 'react';

export const config: ViewConfig = {
  title: 'Banda',
  menu: {
    icon: 'vaadin:clipboard-check',
    order: 2,
    title: 'Banda',
  },
};

type BandaEntryFormProps = {
  onBandaCreated?: () => void;
};

function BandaEntryForm(props: BandaEntryFormProps) {
  const dialogOpened = useSignal(false);

  const nombre = useSignal('');
  const fecha = useSignal('');

  const createBanda = async () => {
      try {
        if ((nombre.value ?? '').trim().length === 0 || (fecha.value ?? '').trim().length === 0) {
            Notification.show('No se pudo crear: faltan datos obligatorios', { duration: 5000, position: 'top-center', theme: 'error' });
            return;
        }
        await BandaService.createBanda(nombre.value, fecha.value);
        if (props.onBandaCreated) {
          props.onBandaCreated();
        }
        nombre.value = '';
        fecha.value = '';
        dialogOpened.value = false;
        Notification.show('Banda creada exitosamente', { duration: 5000, position: 'bottom-end', theme: 'success' });
      } catch (error: unknown) {
        console.log(error);
        handleError(error);
        Notification.show((error as Error)?.message || 'Error desconocido al crear la banda', { duration: 5000, position: 'top-center', theme: 'error' });
      }
    };

  return (
    <>
      <Dialog
        modeless
        headerTitle="Registrar Banda"
        opened={dialogOpened.value}
        onOpenedChanged={(event) => {
          dialogOpened.value = event.detail.value;
        }}
        footer={
          <>
            <Button onClick={() => dialogOpened.value = false}>Cancelar</Button>
            <Button theme="primary" onClick={createBanda}>
              Registrar
            </Button>
          </>
        }
      >
        <VerticalLayout style={{ alignItems: 'stretch', width: '300px', maxWidth: '100%' }}>
          <TextField label="Nombre"
            placeholder='Ingrese el nombre de la banda'
            aria-label='Ingrese el nombre de la banda'
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
        </VerticalLayout>
      </Dialog>
      <Button onClick={() => dialogOpened.value = true}>Registrar</Button>
    </>
  );
}

type BandaEntryFormUpdateProps =  {
  arguments: Banda;
  onBandaUpdated?: () => void;
};

function BandaEntryFormUpdate(props: BandaEntryFormUpdateProps) {
  const dialogOpened = useSignal(false);

  const nombre = useSignal(props.arguments.nombre ?? '');
  const fecha = useSignal(props.arguments.fecha ? new Date(props.arguments.fecha as string).toISOString().split('T')[0] : '');
  const id = useSignal(props.arguments.id);

  useEffect(() => {
    nombre.value = props.arguments.nombre ?? '';
    fecha.value = props.arguments.fecha ? new Date(props.arguments.fecha as string).toISOString().split('T')[0] : '';
    id.value = props.arguments.id;
  }, [props.arguments]);

  const updateBanda = async () => {
      try {
        if (
          (nombre.value ?? '').trim().length === 0 ||
          (fecha.value ?? '').trim().length === 0 ||
          id.value === undefined ||
          id.value === null ||
          id.value <= 0
        ) {
            Notification.show('No se pudo actualizar: faltan datos o ID inválido', { duration: 5000, position: 'top-center', theme: 'error' });
            return;
        }
        await BandaService.updateBanda(id.value, nombre.value, fecha.value);
        if (props.onBandaUpdated) {
          props.onBandaUpdated();
        }
        dialogOpened.value = false;
        Notification.show('Banda actualizada exitosamente', { duration: 5000, position: 'bottom-end', theme: 'success' });
      } catch (error: unknown) {
        console.log(error);
        handleError(error);
        Notification.show((error as Error)?.message || 'Error desconocido al actualizar la banda', { duration: 5000, position: 'top-center', theme: 'error' });
      }
    };

  return (
    <>
      <Dialog
        modeless
        headerTitle="Editar Banda"
        opened={dialogOpened.value}
        onOpenedChanged={(event) => {
          dialogOpened.value = event.detail.value;
        }}
        footer={
          <>
            <Button onClick={() => dialogOpened.value = false}>Cancelar</Button>
            <Button theme="primary" onClick={updateBanda}>
              Actualizar
            </Button>
          </>
        }
      >
        <VerticalLayout style={{ alignItems: 'stretch', width: '300px', maxWidth: '100%' }}>
          <TextField label="Nombre"
            placeholder='Ingrese el nombre de la banda'
            aria-label='Ingrese el nombre de la banda'
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
        </VerticalLayout>
      </Dialog>
      <Button onClick={() => dialogOpened.value = true}>Editar</Button>
    </>
  );
}

const dateFormatter = new Intl.DateTimeFormat('es-ES', {
  dateStyle: 'medium',
  
});

export default function BandaListView() {
    const [items, setItems] = useState<Record<string, unknown>[]>([]);

    const callData = async (): Promise<void> => {
        try {
            const data = await BandaService.listBanda();
            setItems(
                (data ?? [])
                  .filter((item): item is Record<string, string | undefined> => item !== undefined)
                  .map(item => ({ ...item } as Record<string, unknown>))
            );
        } catch (error) {
            console.error("Error al cargar datos de bandas:", error);
            handleError(error);
            Notification.show('Error al cargar la lista de bandas', { duration: 5000, position: 'top-center', theme: 'error' });
        }
    };

    useEffect(() => {
        callData();
    }, []);

    function index({ model }: { model: GridItemModel<Record<string, unknown>> }) {
        return (
            <span>
                {model.index + 1}
            </span>
        );
    }

    function link({ item }: { item: Record<string, unknown> }) {
        const bandaItem: Banda = {
            id: item.id as number | undefined,
            nombre: item.nombre as string | undefined,
            fecha: item.fecha as string | undefined
        };
        return (
            <span>
                <BandaEntryFormUpdate arguments={bandaItem} onBandaUpdated={callData} />
            </span>
        );
    }

    return (
        <main className="w-full h-full flex flex-col box-border gap-s p-m">
            <ViewToolbar title="Banda">
                <Group>
                    <BandaEntryForm onBandaCreated={callData} />
                </Group>
            </ViewToolbar>
            <Grid items={items}>
                <GridColumn header="Nro" renderer={index} />
                <GridColumn path="nombre" header="Nombre de la banda" />
                <GridColumn path="fecha" header="Fecha de creacion">
                    {({ item }) => {
                        const fechaStr = item.fecha as string || '';
                        const fechaObj = new Date(fechaStr);
                        return isNaN(fechaObj.getTime()) ? 'Nunca' : dateFormatter.format(fechaObj);
                    }}
                </GridColumn>
                <GridColumn header="Acciones" renderer={link} />
            </Grid>
        </main>
    );
}