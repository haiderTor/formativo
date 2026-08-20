import { Link } from 'react-router-dom';

const HomePersonas = () => {
  const buttons = [
    { label: 'Exportar clientes', variant: '#2f6fed' },
    { label: 'Importar', variant: '#6c757d' },
    { label: 'Crear Cliente', variant: '#198754', to: '/app/clientes' },
  ];

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-end   ',
        gap: '12px',
        padding: '16px',
      }}
    >
      {buttons.map((button) => {
        const buttonStyle = {
          backgroundColor: button.variant,
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          padding: '10px 16px',
          fontSize: '14px',
          fontWeight: 600,
          cursor: 'pointer',
          minWidth: '170px',
          textAlign: 'left',
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.12)',
          textDecoration: 'none',
          display: 'inline-block',
        };

        if (button.to) {
          return (
            <Link key={button.label} to={button.to} style={buttonStyle}>
              {button.label}
            </Link>
          );
        }

        return (
          <button
            key={button.label}
            type="button"
            style={buttonStyle}
          >
            {button.label}
          </button>
        );
      })}
    </div>
  );
};

export default HomePersonas;
