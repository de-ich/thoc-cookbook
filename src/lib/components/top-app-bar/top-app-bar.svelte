<header id="app-bar">
	<div class="flex w-full flex-col items-center">
		<div class="flex h-16 w-full flex-row items-center p-3 xl:max-w-screen-xl">
			<slot />
		</div>
		<div
			class="h-2 w-full bg-primary xl:max-w-screen-2xl xl:bg-gradient-to-r xl:from-background xl:via-primary xl:to-background"
		></div>
	</div>
</header>
