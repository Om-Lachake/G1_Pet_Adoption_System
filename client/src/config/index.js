export const registerFormControls = [ //signup form
  {
    name: "username",
    label: "User Name",
    placeholder: "Enter your user name",
    componentType: "input",
    type: "text",
  },
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
  {
    name: "rpassword",
    label: "Retype Password",
    placeholder: "Re-enter your password",
    componentType: "input",
    type: "password",
  }
];

export const loginFormControls = [//login form 
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
];

export const forgotPasswordControls = [//forgot password form
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  }
];

export const loginGoogleControls = [//google oAuth form 

];

export const passwordGoogleControls = [//new password after google sign up form
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
  {
    name: "username",
    label: "User Name",
    placeholder: "Enter your user name",
    componentType: "input",
    type: "text",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
  {
    name: "rpassword",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
];

export const verifyOTPcontrols = [//OTP verification form
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
  {
    name:"OTP",
    label:"OTP",
    placeholder:"Enter OTP",
    componentType:"input",
    type:"text"
  }
];

export const newPasswordControls = [//new password form
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
  {
    name:"OTP",
    label:"OTP",
    placeholder:"Enter OTP",
    componentType:"input",
    type:"text"
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
  {
    name: "rpassword",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
];

export const addPetFormElements = [
  {
    label: "Name",
    name: "name",
    componentType: "input",
    type: "text",
    placeholder: "Enter pet name",
  },
  {
    label: "Type",
    name: "type",
    componentType: "input",
    type: "text",
    placeholder: "Enter pet type",
  },
  {
    label: "Gender",
    name: "gender",
    componentType: "select",
    type: "text",
    options: [
      { id: "male", label: "Male" },
      { id: "female", label: "Female" },
    ],
  },
  {
    label: "Age",
    name: "age",
    componentType: "input",
    type: "number",
    placeholder: "Enter pet age",
  },
  {
    label: "Description",
    name: "description",
    componentType: "textarea",
    placeholder: "Enter pet description",
  },
];

export const PetViewHeaderMenuItems = [
  {
    id: "home",
    label: "Home",
    path: "/pet/home",
  },
  {
    id: "pets",
    label: "Pets",
    path: "/pet/listing",
  }
];

export const filterOptions = {
  Category: [
    { id: "Dog", label: "Dog" },
    { id: "Cat", label: "Cat" },
    { id: "Bird", label: "Bird" },
    { id:"Hamster", label:"Hamster"}
  ],
  Gender: [
    { id: "male", label: "Male" },
    { id: "female", label: "Female" }
  ]
};