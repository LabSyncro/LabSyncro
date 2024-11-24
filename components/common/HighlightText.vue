<script setup lang="ts">
const props = defineProps<{
  matchText?: string;
  text: string;
}>();

function getRegexFromText (text: string): RegExp {
  const ignoreAccentText = text
    .replaceAll('(', '\\(')
    .replaceAll(/[ăĂ]/g, '(?:[ăắằặẳĂẮẰẶẲ])')
    .replaceAll(/[Ââ]/g, '(?:[âấầậẩẫÂẤẦẬẨẪ])')
    .replaceAll(/[aA]/g, '(?:[aàáạảãăắằặẳâấầậẩẫAÀÁẠẢÃĂẮẰẶẲÂẤẦẬẨẪ])')
    .replaceAll(/[Ơơ]/g, '(?:[ơớờởợỡƠỚỜỞỢỠ])')
    .replaceAll(/[Ôô]/g, '(?:[ôộồốổỗÔỘỒỐỔỖ])')
    .replaceAll(/[oO]/g, '(?:[oòóọỏõơớờởợỡôộồốổỗOÒÓỌỎÕƠỚỜỞỢỠÔỘỒỐỔỖ])')
    .replaceAll(/[Êê]/g, '(?:[êếềệễểÊẾỀỆỄỂ])')
    .replaceAll(/[eE]/g, '(?:[eèéẻẽẹêếềệễểEÈÉẺẼẸÊẾỀỆỄỂ])')
    .replaceAll(/[Ưư]/g, '(?:[ưựữửừứƯỰỮỬỪỨ])')
    .replaceAll(/[uU]/g, '(?:[uùúụũủưựữửừứUÙÚỤŨỦƯỰỮỬỪỨ])')
    .replaceAll(/[iI]/g, '(?:[iíìịỉĩIÍÌỊỈĨ])')
    .replaceAll(/[dD]/g, '(?:[dđDĐ])');
  return new RegExp(`(${ignoreAccentText})`, 'ig');
}
</script>

<template>
  <p v-if="matchText">
    <span
      v-for="(fragment, index) in props.text.split(getRegexFromText(matchText!))"
      :key="index">
      <span :class="index % 2 ? 'text-tertiary-dark' : ''">{{ fragment }}</span>
    </span>
  </p>
  <p v-else>
    {{ text }}
  </p>
</template>
