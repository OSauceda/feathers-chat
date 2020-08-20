const socket = io();
const client = feathers();

client.configure(feathers.socketio(socket));

client.configure(feathers.authentication({
  storage: window.localStorage
}));

const login = async (credentials) => {
  try {
    if (!credentials) {
      await client.reAuthenticate();
    } else {

     await client.authenticate({
        strategy: 'local',
        ...credentials
      });
    }

    // show chat messages
    console.log('signup / login success! go to chat window...');
  } catch(e) {
    showLogin(e);
  }
};

const main = async () => {
  const auth = await login();

  console.log('User is authenticated', auth);

  await client.logout();
};

main();

const loginHtml = `
  <main class="login container">
    <div class="row">
      <div class="col-12 col-6-tablet push-3-tablet text-center heading">
        <h1 class="font-100">Log in or signup</h1>
      </div>
    </div>
    <div class="row">
      <div class="col-12 col-6-tablet push-3-tablet col-4-desktop push-4-desktop">
        <form class="form">
          <fieldset>
            <input type="email" name="email" placeholder="email" class="block" />
          </fieldset>
          <fieldset>
            <input type="password" name="password" placeholder="password" class="block" />
          </fieldset>
          <button type="button" id="login" class="button button-primary block signup">
            Log in
          </button>
          <button type="button" id="signup" class="button button-primary block signup">
            Sign up and log in
          </button>
          <a href="/oauth/github" class="button button-primary">
            Login with Github
          </a>
        </form>
      </div>
    </div>
  </main>
`;

const showLogin = (error) => {
  if (document.querySelectorAll('.login').length && error) {
    document.querySelector('.heading').insertAdjacentHTML('beforeend', `<p> There was an error: ${error.message}</p>`);
  } else {
    document.getElementById('app').innerHTML = loginHtml;
  }
};

showLogin();

const getCredentials = () => {
  const user = {
    email: document.querySelector('[name="email"]').value,
    password: document.querySelector('[name="password"]').value,
  };

  return user;
};

const addEventListener = (selector, event, callback) => {
  document.addEventListener(event, async (event) => {
    if (event.target.closest(selector)) {
      callback(event);
    }
  });
};

addEventListener('#signup', 'click', async () => {
  const credentials = getCredentials();

  await client.service('users').create(credentials);

  await login(credentials);
});
