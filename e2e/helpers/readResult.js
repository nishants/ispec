module.exports = (result) => {
  const passed = result.passed.map(r => r.spec.name);
  const failed = result.failed.map(r => r.spec.name);
  const obj = {};
  if(passed.length){
    obj.passed = passed;
  }
  if(failed.length){
    obj.failed = failed;
  }

  return obj;
};