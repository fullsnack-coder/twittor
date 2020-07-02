function actualizarCacheDinamico(dynamicName, req, res) {
  if (res.ok) {
    return caches.open(dynamicName).then((c) => {
      c.put(req, res.clone());
      return res.clone();
    });
  }
  return res.clone();
}
