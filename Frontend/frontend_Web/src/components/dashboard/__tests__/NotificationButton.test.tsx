import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import NotificationButton from '../NotificationButton';
import { getNotifications } from '@/api/services/notificationApi';

// Mock del servicio de notificaciones
jest.mock('@/api/services/notificationApi');

const mockGetNotifications = getNotifications as jest.MockedFunction<typeof getNotifications>;

describe('NotificationButton', () => {
  const mockOnClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debe renderizar el botón de notificaciones', () => {
    mockGetNotifications.mockResolvedValue([]);
    
    render(<NotificationButton onClick={mockOnClick} />);
    
    const button = screen.getByLabelText('Notificaciones');
    expect(button).toBeInTheDocument();
  });

  it('debe mostrar el badge con el contador de notificaciones no leídas', async () => {
    mockGetNotifications.mockResolvedValue([
      {
        id: '1',
        title: 'Test',
        message: 'Test message',
        type: 'info',
        read: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        title: 'Test 2',
        message: 'Test message 2',
        type: 'info',
        read: false,
        createdAt: new Date().toISOString(),
      },
    ]);

    render(<NotificationButton onClick={mockOnClick} />);

    await waitFor(() => {
      const badge = screen.getByText('2');
      expect(badge).toBeInTheDocument();
    });
  });

  it('no debe mostrar el badge si no hay notificaciones no leídas', async () => {
    mockGetNotifications.mockResolvedValue([
      {
        id: '1',
        title: 'Test',
        message: 'Test message',
        type: 'info',
        read: true,
        createdAt: new Date().toISOString(),
      },
    ]);

    render(<NotificationButton onClick={mockOnClick} />);

    await waitFor(() => {
      const badge = screen.queryByText('1');
      expect(badge).not.toBeInTheDocument();
    });
  });

  it('debe llamar a onClick cuando se hace clic en el botón', () => {
    mockGetNotifications.mockResolvedValue([]);
    
    render(<NotificationButton onClick={mockOnClick} />);
    
    const button = screen.getByLabelText('Notificaciones');
    fireEvent.click(button);
    
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('debe mostrar "99+" cuando hay más de 99 notificaciones no leídas', async () => {
    const notifications = Array.from({ length: 100 }, (_, i) => ({
      id: `${i}`,
      title: `Test ${i}`,
      message: `Test message ${i}`,
      type: 'info' as const,
      read: false,
      createdAt: new Date().toISOString(),
    }));

    mockGetNotifications.mockResolvedValue(notifications);

    render(<NotificationButton onClick={mockOnClick} />);

    await waitFor(() => {
      const badge = screen.getByText('99+');
      expect(badge).toBeInTheDocument();
    });
  });

  it('debe manejar errores al obtener notificaciones', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation();
    mockGetNotifications.mockRejectedValue(new Error('API Error'));

    render(<NotificationButton onClick={mockOnClick} />);

    await waitFor(() => {
      expect(consoleError).toHaveBeenCalled();
    });

    consoleError.mockRestore();
  });
});