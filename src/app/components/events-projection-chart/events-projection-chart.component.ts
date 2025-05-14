import { Component, computed, input, Input } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';
import { IEventsProjection } from '../../../api/mock/mock.model';
import { getWeekday } from '../../../lib/utils';

@Component({
  selector: 'events-projection-chart',
  templateUrl: './events-projection-chart.component.html',
  imports: [BaseChartDirective],
})
export class EventsProjectionChart {
  eventsProjection = input.required<IEventsProjection[]>();
  readonly chartData = computed(() =>
    this.parseChartData(this.eventsProjection())
  );

  readonly chartOptions: ChartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      title: {
        display: true,
        align: 'center',
        position: 'left',
        text: 'Quantidade de eventos',
      },
      subtitle: {
        align: 'center',
        position: 'bottom',
      },
      legend: {
        align: 'center',
        position: 'bottom',
      },
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        beginAtZero: true,
      },
    },
  };

  parseChartData(eventsData: IEventsProjection[]): ChartData<'bar', unknown> {
    const weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

    const data = eventsData.map(({ day, events }) => ({
      x: weekdays[day],
      ...events,
    }));

    const today = getWeekday();
    if (today > 0 && today < 6) {
      data[today - 1].x = 'Hoje';

      const daysToSplice = today - 1;
      data.push(...data.splice(0, daysToSplice));
    }

    return {
      datasets: [
        {
          label: 'Encontros',
          data: data,
          backgroundColor: '#40bb72',
          parsing: {
            yAxisKey: 'meetings',
          },
        },
        {
          label: 'Mensagens',
          data: data,
          backgroundColor: '#969696',
          parsing: {
            yAxisKey: 'emails',
          },
        },
        {
          label: 'Checkpoints',
          data: data,
          backgroundColor: '#5cc5dc',
          parsing: {
            yAxisKey: 'calls',
          },
        },
        {
          label: 'Exploração',
          data: data,
          backgroundColor: '#8689ff',
          parsing: {
            yAxisKey: 'follows',
          },
        },
      ],
    };
  }
}
