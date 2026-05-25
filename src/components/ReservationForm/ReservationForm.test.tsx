import { render, screen } from '@testing-library/react';
import ReservationForm from './ReservationForm';

describe('ReservationForm', () => {
  // Anti-patrón: único test que solo verifica existencia del input
  // No testea validación (F3), ni submit, ni el payload enviado al callback
  it('renders the form inputs', () => {
    const onSubmit = jest.fn();
    render(<ReservationForm onSubmit={onSubmit} />);
    // getByRole('textbox') solo encuentra el primer input tipo text
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  // Anti-patrón: mock de onSubmit que nunca se assertea
  it('has a submit button', () => {
    const onSubmit = jest.fn(); // mock que no se verifica en ningún assert
    render(<ReservationForm onSubmit={onSubmit} />);
    expect(screen.getByRole('button', { name: /reservar/i })).toBeInTheDocument();
  });

  // Sin tests de:
  // - submit con units = 0 (F3)
  // - submit con units negativo (F3)
  // - submit con campos vacíos (F3)
  // - que onSubmit reciba el payload correcto
  // - mensajes de error visibles
  // - accesibilidad de los inputs (F7)
});
