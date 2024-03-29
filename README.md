# smart-brain-api

## Set to an existing Heroku app

To set to an existing Heroku app you already have deployed, you need to know the name of the app you want to deploy to. To see a list of all the apps you currently have on Heroku:

```
heroku apps
```

Copy the name of the app you want to connect the project to, then run:

```
heroku git:remote -a <PASTE_YOUR_APP_NAME_HERE>
```

And now you'll have your repo connected to the heroku app under the git remote name `heroku`.

If the Heroku app you connected was deploying just a create-react-app project from earlier in the lesson, you will need to remove the `mars/create-react-app-buildpack` buildpack first. You can check if you have this buildpack by running:

```
heroku buildpacks
```

Which will list any buildpacks you currently have, if you see `mars/create-react-app-buildpack` in the list, you can remove it by running:

```
heroku buildpacks:remove mars/create-react-app-buildpack
```

Then skip to the bottom of this article to see what to do next!


## To create a new Heroku app

Create a new Heroku project by typing in your terminal:

```
heroku create
```

This will create a new Heroku project for you. Then run:

```
git remote -v
```

You should see heroku `https://git.heroku.com/<RANDOMLY_GENERATED_NAME_OF_YOUR_APP>` in the list. This means you have successfully connected your project to the newly created Heroku app under the git remote of `heroku`.


## Deploying to Heroku

Before we deploy, you may also need to set config variables as specified in your .env file. The `.env` file is only for local development, in order for our heroku production app to have access to this secret key, we add it to our Heroku projects config variables by typing:

```
heroku config:set KEY_NAME_IN_ENV=<SECRET_KEY_VALUE>
```

After that, you can deploy to heroku by running:

```
git push heroku master
```

You will see this warning message if you are pushing to an existing app:

```
! [rejected]        master -> master (fetch first)
error: failed to push some refs to 'https://git.heroku.com/hasura-crwn-clothing.git'
hint: Updates were rejected because the remote contains work that you do
hint: not have locally. This is usually caused by another repository pushing
hint: to the same ref. You may want to first integrate the remote changes
hint: (e.g., 'git pull ...') before pushing again.
hint: See the 'Note about fast-forwards' in 'git push --help' for details.
```

This is because we are pushing to an existing app that was deploying an entirely different repository from what we have now. Simply run:

```
git push heroku master --force
```

This will overwrite the existing Heroku app with our new code.


## Open our Heroku project

After heroku finishes building our project, we can simply run:

```
heroku open
```

This will open up our browser and take us to our newly deployed Heroku project!
