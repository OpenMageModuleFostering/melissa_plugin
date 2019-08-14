<?php
class Melissa_Plugin_Helper_Data extends Mage_Core_Helper_Abstract
{
	public function getExtensionVersion()
	{
		//return (string) Mage::getConfig()->getNode()->modules->Melissa_Plugin->version;
		$version = Mage::getStoreConfig('catalog/backend/version');
		//$version = Mage::getStoreConfig('Melissa_Plugin/version');
		return (string) $version;
	}
}
?>
