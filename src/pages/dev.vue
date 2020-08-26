<template>
<q-layout>
    <div :class="[$style['q-page-container'], $style['q-ma-md']]">
    <div :class="$style['q-card']">
      <q-card-section horizontal>
        <q-card-section class="q-pt-xs">
          <div class="text-overline">{{user ? user.name: 'belum ada'}} </div>
          <div class="text-h5 q-mt-sm q-mb-xs">Title</div>
          <div class="text-caption text-grey" @click="$router.push('/')">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </div>
        </q-card-section>

        <q-card-section class="col-5 flex flex-center">
          <q-img
            class="rounded-borders"
            src="https://cdn.quasar.dev/img/parallax2.jpg"
          />
        </q-card-section>
      </q-card-section>
    </div>
    </div>
</q-layout>
</template>
<script>
import User from 'models/User'
export default {

computed:{
  user(){
    return User.find(1);
  }
  
}

}

</script>

<style lang="css" src="./dev.css" module/>