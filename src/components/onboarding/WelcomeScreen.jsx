
'use client';

const WelcomeScreen = ({ onNext }) => {
  return (
    <div style={{ backgroundColor: 'red', color: 'white', padding: '50px', fontSize: '30px', textAlign: 'center', minHeight: '100vh' }}>
      WELCOME SCREEN IS WORKING!
      <br/>
      <button onClick={onNext} style={{ padding: '20px', fontSize: '20px', margin: '20px', backgroundColor: 'yellow', color: 'black' }}>
        NEXT BUTTON
      </button>
    </div>
  );
};

export default WelcomeScreen;
