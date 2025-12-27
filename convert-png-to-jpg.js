/**
 * PNG to JPG 转换脚本
 * 将 photos 文件夹中的所有 PNG 文件转换为 JPG
 * 
 * 使用方法：
 * node convert-png-to-jpg.js
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// 配置
const CONFIG = {
    // JPG 质量 (75-85 是好的平衡点)
    quality: 80,
    // 要处理的文件夹
    folder: 'photos',
    // 是否删除原始 PNG 文件
    deleteOriginal: true
};

// 统计信息
const stats = {
    total: 0,
    converted: 0,
    skipped: 0,
    errors: 0,
    originalSize: 0,
    convertedSize: 0
};

/**
 * 获取文件大小 (MB)
 */
function getFileSizeMB(filePath) {
    const stats = fs.statSync(filePath);
    return stats.size / (1024 * 1024);
}

/**
 * 转换单个 PNG 文件为 JPG
 */
async function convertPngToJpg(inputPath) {
    try {
        const ext = path.extname(inputPath).toLowerCase();
        
        // 只处理 PNG 文件
        if (ext !== '.png') {
            return;
        }

        const originalSize = getFileSizeMB(inputPath);
        stats.originalSize += originalSize;
        stats.total++;

        const baseName = path.basename(inputPath, ext);
        const dirName = path.dirname(inputPath);
        const outputPath = path.join(dirName, baseName + '.jpg');

        // 检查 JPG 文件是否已存在
        if (fs.existsSync(outputPath)) {
            console.log(`⏭️  跳过: ${path.basename(inputPath)} (JPG 文件已存在)`);
            stats.skipped++;
            return;
        }

        // 转换 PNG 为 JPG
        await sharp(inputPath)
            .jpeg({ 
                quality: CONFIG.quality, 
                mozjpeg: true 
            })
            .toFile(outputPath);

        const convertedSize = getFileSizeMB(outputPath);
        stats.convertedSize += convertedSize;
        stats.converted++;

        const saved = originalSize - convertedSize;
        const savedPercent = saved > 0 ? ((saved / originalSize) * 100).toFixed(1) : '0.0';

        console.log(`✅ 转换: ${path.basename(inputPath)} → ${baseName}.jpg`);
        console.log(`   ${originalSize.toFixed(2)}MB → ${convertedSize.toFixed(2)}MB (节省 ${savedPercent}%)`);

        // 删除原始 PNG 文件
        if (CONFIG.deleteOriginal) {
            fs.unlinkSync(inputPath);
            console.log(`   🗑️  已删除原始 PNG 文件`);
        }

    } catch (error) {
        console.error(`❌ 错误: ${path.basename(inputPath)} - ${error.message}`);
        stats.errors++;
    }
}

/**
 * 主函数
 */
async function main() {
    console.log('🚀 开始转换 PNG 文件为 JPG...\n');
    console.log('配置:');
    console.log(`  - JPG 质量: ${CONFIG.quality}`);
    console.log(`  - 处理文件夹: ${CONFIG.folder}`);
    console.log(`  - 删除原始文件: ${CONFIG.deleteOriginal ? '是' : '否'}\n`);

    // 检查是否安装了 sharp
    try {
        require('sharp');
    } catch (error) {
        console.error('❌ 错误: 未安装 sharp 库');
        console.log('\n请先运行: npm install sharp');
        process.exit(1);
    }

    const folderPath = path.join(__dirname, CONFIG.folder);

    if (!fs.existsSync(folderPath)) {
        console.error(`❌ 错误: 文件夹不存在: ${folderPath}`);
        process.exit(1);
    }

    // 读取文件夹中的所有文件
    const files = fs.readdirSync(folderPath);
    const pngFiles = files.filter(file => 
        /\.png$/i.test(file)
    );

    console.log(`📁 找到 ${pngFiles.length} 个 PNG 文件\n`);

    if (pngFiles.length === 0) {
        console.log('✅ 没有需要转换的 PNG 文件');
        return;
    }

    // 转换所有 PNG 文件
    for (const file of pngFiles) {
        const inputPath = path.join(folderPath, file);
        await convertPngToJpg(inputPath);
    }

    // 显示统计信息
    console.log('\n' + '='.repeat(50));
    console.log('📊 转换统计:');
    console.log(`   总 PNG 文件数: ${stats.total}`);
    console.log(`   已转换: ${stats.converted}`);
    console.log(`   已跳过: ${stats.skipped}`);
    console.log(`   错误: ${stats.errors}`);
    console.log(`   原始大小: ${stats.originalSize.toFixed(2)}MB`);
    console.log(`   转换后大小: ${stats.convertedSize.toFixed(2)}MB`);
    console.log(`   节省空间: ${(stats.originalSize - stats.convertedSize).toFixed(2)}MB`);
    if (stats.originalSize > 0) {
        console.log(`   压缩率: ${(((stats.originalSize - stats.convertedSize) / stats.originalSize) * 100).toFixed(1)}%`);
    }
    console.log('='.repeat(50));
    
    if (stats.converted > 0) {
        console.log('\n✅ 转换完成！');
    }
}

// 运行
main().catch(console.error);

