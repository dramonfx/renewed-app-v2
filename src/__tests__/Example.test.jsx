import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock component for testing
function ExampleComponent() {
  return (
    <div>
      <h1>Welcome to Renewed App</h1>
      <p>This is a test component</p>
    </div>
  );
}

describe('ExampleComponent', () => {
  it('renders the heading', () => {
    render(<ExampleComponent />);
    
    const heading = screen.getByRole('heading', { name: /welcome to renewed app/i });
    expect(heading).toBeInTheDocument();
  });

  it('renders the description text', () => {
    render(<ExampleComponent />);
    
    const description = screen.getByText(/this is a test component/i);
    expect(description).toBeInTheDocument();
  });
});