import { useState } from 'react'
import { Button } from './Components/Ui/Button/button'
import { Checkbox } from './Components/Ui/Checkbox/checkbox'
import { RadioButton } from './Components/Ui/Radio/radio'
import Input from './Components/Ui/Input/input'
import { Switch } from './Components/Ui/switch/switch'
import { SwitchBtn } from './Components/Ui/switch/switchBtn'
import { FiUser, FiSearch, FiMapPin } from "react-icons/fi";
import './App.css'

function App() {
  const [text, setText] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  return (
    <>
<Button label="پرداخت" />
<Button label="محصولات" color="#7889F5" radius={15} />
<Button label="تعریف پیک" color="#7889F5" radius={55} variant="outline" />
<Button label="پرداخت" state="loading" />
<Button label="پرداخت" state="pressed" />
<Button label="پرداخت" state="disabled" />
<Checkbox checked={true} onChange={v => console.log(v)} />
<RadioButton selected={false} onChange={() => console.log("clicked")} />
<Switch on={true} onToggle={() => console.log("toggle switch1")} />
<SwitchBtn on={false} onToggle={() => console.log("toggle switch2")} />


<div style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "2rem", maxWidth: 600, margin: "0 auto" }}>
      
      {/* default */}
      <Input
        label="نام کالا"
        placeholder="نام کالا را وارد کنید"
        value={text}
        onChange={(e) => setText(e.target.value)}
        variant="default"
      />

      {/* withIcon */}
      <Input
        label="نام کاربری"
        placeholder="نام کاربری"
        icon={<FiUser />}
        value={text}
        onChange={(e) => setText(e.target.value)}
        variant="withIcon"
      />

      {/* search */}
      <Input
        label="جستجو"
        placeholder="کالا را جست‌وجو کنید"
        icon={<FiSearch />}
        value={text}
        onChange={(e) => setText(e.target.value)}
        variant="search"
      />

      {/* error */}
      <Input
        label="نام مشتری"
        placeholder="نام مشتری را وارد کنید"
        value={text}
        onChange={(e) => setText(e.target.value)}
        variant="error"
        error="نام مشتری را به درستی وارد نشده است."
        required
      />

      {/* disabled */}
      <Input
        label="شماره تماس"
        placeholder="09123456789"
        value="09127484391"
        onChange={() => {}}
        variant="disabled"
        disabled
      />

      {/* dropdown style */}
      <Input
        label="انتخاب مشتری"
        placeholder="انتخاب مشتری"
        value={text}
        onChange={(e) => setText(e.target.value)}
        variant="dropdown"
      />

      {/* tagged */}
      <Input
        label="بارکد کالا"
        placeholder="بارکد را وارد کنید"
        value={text}
        onChange={(e) => setText(e.target.value)}
        variant="tagged"
        hasButton
        buttonText="ثبت بارکد"
        onButtonClick={() => alert("بارکد ثبت شد")}
      />

      {/* amount */}
      <Input
        label="مبلغ پرداختی:"
        placeholder="مبلغ را وارد کنید"
        suffix="ریال"
        value={text}
        onChange={(e) => setText(e.target.value)}
        variant="amount"
      />

      {/* address (error + icon) */}
      <Input
        label="آدرس:"
        placeholder="آدرس را وارد کنید"
        value={text}
        onChange={(e) => setText(e.target.value)}
        variant="error"
        error="آدرس مشتری را برای ارسال وارد کنید"
        icon={<FiMapPin />}
      />

      {/* image upload */}
      <Input
        label="عکس:"
        value=""
        onChange={() => {}}
        variant="imageUpload"
        onUpload={(file) => {
          setImageFile(file);
          alert(`تصویر آپلود شد: ${file.name}`);
        }}
      />

    </div>
    </>
  )
}

export default App
