import { fireEvent, render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './auth/AuthContext';

const books = [
  { id: 'book-1', title: 'หนังสือทดสอบ', author: 'นักเขียน ก', category: 'วรรณกรรม', price: 120, cover_url: 'https://example.com/book.jpg', description: '', stock: 8 },
  { id: 'book-2', title: 'คู่มือจิตวิทยา', author: 'นักเขียน ข', category: 'จิตวิทยา', price: 200, cover_url: 'https://example.com/mind.jpg', description: '', stock: 5 },
];

function renderApp() {
  return render(<BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><AuthProvider><App/></AuthProvider></BrowserRouter>);
}

beforeEach(() => {
  localStorage.clear();
  global.fetch = jest.fn().mockResolvedValue({ ok: true, status: 200, json: async () => books });
});

describe('BookMart storefront', () => {
  test('shows the guest catalogue from the API', async () => {
    renderApp();
    expect(await screen.findByText('หนังสือทดสอบ')).toBeInTheDocument();
    expect(screen.getByText('เลือกเรื่องราว')).toBeInTheDocument();
  });

  test('filters books by category', async () => {
    renderApp();
    await screen.findByText('หนังสือทดสอบ');
    fireEvent.click(screen.getByRole('button', { name: 'จิตวิทยา' }));
    expect(screen.getByText('คู่มือจิตวิทยา')).toBeInTheDocument();
    expect(screen.queryByText('หนังสือทดสอบ')).not.toBeInTheDocument();
  });

  test('adds a book to the cart and displays the correct total', async () => {
    renderApp();
    await screen.findByText('หนังสือทดสอบ');
    fireEvent.click(screen.getByRole('button', { name: 'ซื้อ หนังสือทดสอบ' }));
    fireEvent.click(screen.getByRole('button', { name: /^ตะกร้า/ }));
    expect(screen.getByText('ตะกร้าหนังสือ')).toBeInTheDocument();
    expect(screen.getAllByText('฿120')).toHaveLength(3);
  });

  test('sends a guest to login before checkout', async () => {
    renderApp();
    await screen.findByText('หนังสือทดสอบ');
    fireEvent.click(screen.getByRole('button', { name: 'ซื้อ หนังสือทดสอบ' }));
    fireEvent.click(screen.getByRole('button', { name: /^ตะกร้า/ }));
    fireEvent.click(screen.getByRole('button', { name: /ดำเนินการสั่งซื้อ/ }));
    expect(await screen.findByText('กลับมาอ่านด้วยกัน')).toBeInTheDocument();
  });
});
