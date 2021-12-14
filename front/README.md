# front

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

The dist folders should be mapped to the static directory in the back repo (the back will serve the front)

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

# back
```
cd back
npm install
ln -s static ../front/dist
```




