import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

const socket = io('https://hellwatch.onrender.com'); // адрес сервера socket.io

function App() {
  const [frameSrc, setFrameSrc] = useState('');
  const [formValue, setFormValue] = useState('');
  const frameRef = useRef(null);

  // обработчик события изменения адреса фрейма
  const handleFrameSrcChanged = (newFrameSrc) => {
    setFrameSrc(newFrameSrc);
  };

  // обработчик события загрузки фрейма
  const handleFrameLoaded = () => {
    socket.emit('frameLoaded'); // отправляем событие о загрузке фрейма на сервер
  };

  // обработчик события изменения времени фрейма
  const handleFrameTime = (time) => {
    frameRef.current.currentTime = time; // устанавливаем текущее время фрейма
  };

  // подписываемся на события от сервера при монтировании компонента
  useEffect(() => {
    socket.on('frameSrcChanged', handleFrameSrcChanged);
    socket.on('frameLoaded', handleFrameLoaded);
    socket.on('frameTime', handleFrameTime);
    return () => {
      socket.off('frameSrcChanged', handleFrameSrcChanged);
      socket.off('frameLoaded', handleFrameLoaded);
      socket.off('frameTime', handleFrameTime);
    };
  }, []);

  // обработчик отправки формы
  const handleSubmit = (event) => {
    console.log("Submit!")
    event.preventDefault();
    socket.emit('frameSrcChanged', formValue); // отправляем новый адрес фрейма на сервер
    setFormValue(''); // очищаем поле ввода
  };

  // обработчик изменения значения поля ввода
  const handleChange = (event) => {
    setFormValue(event.target.value);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Ссылка на фрейм:
          <input type="text" value={formValue} onChange={handleChange} />
        </label>
        <button type="submit">Изменить</button>
      </form>
      <iframe
        referrerPolicy="no-referrer"
        ref={frameRef}
        src={"https://hellwatch.onrender.com/iframe?url="+frameSrc}
        title="Shared Frame"
        width="100%"
        height="600"
        allowFullScreen
        onLoad={handleFrameLoaded}
      ></iframe>
    </div>
  );
}

export default App;
