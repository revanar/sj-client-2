import Route from '@ember/routing/route';
import ENV from '../config/environment';

export default Route.extend({
  model(params){
    //USER EDITABLE PARAMS (from queryParams)
    for (const key in params){
      if (!params.hasOwnProperty(key)) {continue;}
      //removes any params that haven't been assigned a value
      if (params[key] === '' || params[key] === null || params[key].length === 0){
        delete params[key];
      }
    }
    //SYSTEM-BASED PARAMS
    params.api_key = ENV.APP.api_key;
    params.fields=ENV.APP.searchFields;
    params.facets=ENV.APP.facets;
    params.facets_per_page = ENV.APP.facets_per_page;
/*
    //MOVE TO FACET FILTER COMPONENT?
    const facets = this.controllerFor('search').get('recordFacets');
    if(facets.length > 0){
      params.facets = facets;
      params.facets_per_page = 50; //can go up to 100
    }*/
    //MODEL RETURN
    //fetches the model from the API with given params
    return this.get('store').query('record', params);
  },
  renderTemplate(){
    this.render(); //renders current template/model as usual
    this.render('search-bar', { //also renders the search-bar template into the application
      into: 'application',
      outlet: 'search-bar'
    });
    this.render('search-filters', {
      into: 'application',
      outlet: 'search-filters'
    });
  },
  queryParams: {
    page: {refreshModel: true},
    text: {refreshModel: true},
    per_page: {refreshModel: true, replace: true},
    and: {refreshModel: true},
    fuzzySearch: {refreshModel: true}
  },
  actions: {
    loading(transition){
      let controller = this.controllerFor('search');
      controller.set('isLoading', true);
      transition.promise.finally(function(){
        controller.set('isLoading', false);
      });
    }
  }
});