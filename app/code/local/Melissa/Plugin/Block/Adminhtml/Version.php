<?php
class Melissa_Plugin_Block_Adminhtml_Version
    extends Mage_Adminhtml_Block_System_Config_Form_Field
	{
		protected function _getElementHtml(Varien_Data_Form_Element_Abstract $element)
		{
			//return (string) Mage::getConfig()->getNode()->modules->Melissa_Plugin->version;
		$version = Mage::getStoreConfig('catalog/backend/version');
		//$version = Mage::getStoreConfig('Melissa_Plugin/version');
		return (string) $version;
		
		}
	}
?>
