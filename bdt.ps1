# This script helps build and deploy the extension

param(
# Switch to publish the extension
[switch]$publish,

# Configuration: dev or release, default is 'dev'
[string]$config="dev",

# Switch to push new version
[switch]$push
)

if($config -eq "release"){
	$configJsonFile = ".\configs\release.json";
} else {
	$configJsonFile = ".\configs\dev.json";
}

$configJson = Get-Content $configJsonFile | Out-String | ConvertFrom-Json

$extensionId=[string]$configJson.id
Write-Host "ExtensionId: $extensionId"

$version=[version]$configJson.version
Write-Host "Existing version: $version"

$publisher=[string]$configJson.publisher
Write-Host "Publisher: $publisher"

$buildNumber=$version.Build
$buildNumber=$buildNumber+1
$newVersion=[version]("{0}.{1}.{2}" -f $version.Major, $version.Minor, $buildNumber)

Write-Host "New version: $newVersion"

$configJson.version=[string]$newVersion
$configJson | ConvertTo-Json -depth 100 | Out-File $configJsonFile -Encoding ascii

if($push)
{
	# Checkin the updated manifest
	git add $configJsonFile
	git commit -m "Updated $config version to $version"
	git push
}

if($config -eq "release")
{
	npm run package:release
}
else
{
	npm run package:dev
}

if($publish)
{
	$packageName = ".\dist\{0}.{1}-{2}.vsix" -f $publisher, $extensionId, $newVersion

	# Read the PAT token from your local file
	$patToken=Get-Content C:\tfxpat.txt

	tfx extension publish --vsix $packageName --auth-type 'pat' --token $patToken
}
